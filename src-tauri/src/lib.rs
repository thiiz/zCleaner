use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use sysinfo::{System, Disks};
use tauri::Emitter;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TempFile {
    pub path: String,
    pub name: String,
    pub size: u64,
    pub category: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ScanResult {
    pub files: Vec<TempFile>,
    pub total_size: u64,
}

fn get_dir_size(path: &PathBuf) -> u64 {
    let mut total = 0;
    if let Ok(entries) = fs::read_dir(path) {
        for entry in entries.flatten() {
            if let Ok(metadata) = entry.metadata() {
                if metadata.is_file() {
                    total += metadata.len();
                } else if metadata.is_dir() {
                    total += get_dir_size(&entry.path());
                }
            }
        }
    }
    total
}

#[tauri::command]
fn scan_temp_files() -> Result<ScanResult, String> {
    let mut files = Vec::new();
    let mut total_size = 0u64;

    // Windows Temp folders
    if let Ok(temp_dir) = std::env::var("TEMP") {
        let temp_path = PathBuf::from(&temp_dir);
        if let Ok(entries) = fs::read_dir(&temp_path) {
            for entry in entries.flatten() {
                if let Ok(metadata) = entry.metadata() {
                    let size = if metadata.is_file() {
                        metadata.len()
                    } else if metadata.is_dir() {
                        get_dir_size(&entry.path())
                    } else {
                        0
                    };

                    if size > 0 {
                        files.push(TempFile {
                            path: entry.path().to_string_lossy().to_string(),
                            name: entry.file_name().to_string_lossy().to_string(),
                            size,
                            category: "Arquivos Temporários do Windows".to_string(),
                        });
                        total_size += size;
                    }
                }
            }
        }
    }

    // Windows Prefetch
    let prefetch_path = PathBuf::from("C:\\Windows\\Prefetch");
    if prefetch_path.exists() {
        if let Ok(entries) = fs::read_dir(&prefetch_path) {
            for entry in entries.flatten() {
                if let Ok(metadata) = entry.metadata() {
                    if metadata.is_file() {
                        let size = metadata.len();
                        files.push(TempFile {
                            path: entry.path().to_string_lossy().to_string(),
                            name: entry.file_name().to_string_lossy().to_string(),
                            size,
                            category: "Prefetch do Windows".to_string(),
                        });
                        total_size += size;
                    }
                }
            }
        }
    }

    // Browser caches
    if let Ok(local_app_data) = std::env::var("LOCALAPPDATA") {
        let browser_caches = vec![
            (format!("{}\\Google\\Chrome\\User Data\\Default\\Cache", local_app_data), "Cache do Chrome"),
            (format!("{}\\Microsoft\\Edge\\User Data\\Default\\Cache", local_app_data), "Cache do Edge"),
            (format!("{}\\Mozilla\\Firefox\\Profiles", local_app_data), "Cache do Firefox"),
        ];

        for (cache_path, category) in browser_caches {
            let path = PathBuf::from(&cache_path);
            if path.exists() {
                let size = get_dir_size(&path);
                if size > 0 {
                    files.push(TempFile {
                        path: cache_path,
                        name: category.to_string(),
                        size,
                        category: "Cache de Navegadores".to_string(),
                    });
                    total_size += size;
                }
            }
        }
    }

    Ok(ScanResult { files, total_size })
}

#[derive(Clone, Serialize)]
struct DeleteProgress {
    current: usize,
    total: usize,
    percentage: f32,
    deleted_size: u64,
}

#[tauri::command]
fn delete_temp_files(app: tauri::AppHandle, paths: Vec<String>) -> Result<u64, String> {
    let mut deleted_size = 0u64;
    let total = paths.len();

    for (index, path_str) in paths.iter().enumerate() {
        let path = PathBuf::from(&path_str);
        if path.exists() {
            if let Ok(metadata) = fs::metadata(&path) {
                let size = if metadata.is_file() {
                    metadata.len()
                } else {
                    get_dir_size(&path)
                };

                let result = if metadata.is_file() {
                    fs::remove_file(&path)
                } else {
                    fs::remove_dir_all(&path)
                };

                if result.is_ok() {
                    deleted_size += size;
                }
            }
        }

        // Emit progress event
        let progress = DeleteProgress {
            current: index + 1,
            total,
            percentage: ((index + 1) as f32 / total as f32) * 100.0,
            deleted_size,
        };
        let _ = app.emit("delete-progress", progress);
    }

    Ok(deleted_size)
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SystemInfo {
    pub cpu_name: String,
    pub cpu_cores: usize,
    pub total_memory: u64,
    pub used_memory: u64,
    pub os_name: String,
    pub os_version: String,
    pub kernel_version: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DiskInfo {
    pub name: String,
    pub mount_point: String,
    pub total_space: u64,
    pub available_space: u64,
    pub is_removable: bool,
    pub file_system: String,
}

#[tauri::command]
fn get_system_info() -> Result<SystemInfo, String> {
    let mut sys = System::new_all();
    sys.refresh_all();

    let cpu_name = sys
        .cpus()
        .first()
        .map(|cpu| cpu.brand().to_string())
        .unwrap_or_else(|| "Desconhecido".to_string());

    let cpu_cores = sys.cpus().len();
    let total_memory = sys.total_memory();
    let used_memory = sys.used_memory();

    let os_name = System::name().unwrap_or_else(|| "Desconhecido".to_string());
    let os_version = System::os_version().unwrap_or_else(|| "Desconhecido".to_string());
    let kernel_version = System::kernel_version().unwrap_or_else(|| "Desconhecido".to_string());

    Ok(SystemInfo {
        cpu_name,
        cpu_cores,
        total_memory,
        used_memory,
        os_name,
        os_version,
        kernel_version,
    })
}

#[tauri::command]
fn get_disk_info() -> Result<Vec<DiskInfo>, String> {
    let disks = Disks::new_with_refreshed_list();
    let mut disk_list = Vec::new();

    for disk in disks.list() {
        disk_list.push(DiskInfo {
            name: disk.name().to_string_lossy().to_string(),
            mount_point: disk.mount_point().to_string_lossy().to_string(),
            total_space: disk.total_space(),
            available_space: disk.available_space(),
            is_removable: disk.is_removable(),
            file_system: disk.file_system().to_string_lossy().to_string(),
        });
    }

    Ok(disk_list)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            scan_temp_files,
            delete_temp_files,
            get_system_info,
            get_disk_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
