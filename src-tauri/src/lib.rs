use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

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

#[tauri::command]
fn delete_temp_files(paths: Vec<String>) -> Result<u64, String> {
    let mut deleted_size = 0u64;

    for path_str in paths {
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
    }

    Ok(deleted_size)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![scan_temp_files, delete_temp_files])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
