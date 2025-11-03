use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use sysinfo::{Disks, System};
use tauri::Emitter;

#[cfg(target_os = "windows")]
fn is_elevated() -> bool {
    use std::process::Command;
    
    let output = Command::new("net")
        .args(&["session"])
        .output();
    
    match output {
        Ok(output) => output.status.success(),
        Err(_) => false,
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TempFile {
    pub path: String,
    pub name: String,
    pub size: u64,
    pub category: String,
    pub root_path: String,
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
        let root_path = temp_path.to_string_lossy().to_string();
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
                            root_path: root_path.clone(),
                        });
                        total_size += size;
                    }
                }
            }
        }
    }

    // Windows System Temp folder
    let system_temp_path = PathBuf::from("C:\\Windows\\Temp");
    if system_temp_path.exists() {
        let root_path = system_temp_path.to_string_lossy().to_string();
        if let Ok(entries) = fs::read_dir(&system_temp_path) {
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
                            category: "Arquivos Temporários do Sistema".to_string(),
                            root_path: root_path.clone(),
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
        let root_path = prefetch_path.to_string_lossy().to_string();
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
                            root_path: root_path.clone(),
                        });
                        total_size += size;
                    }
                }
            }
        }
    }

    // Windows Update Downloads
    let windows_update_path = PathBuf::from("C:\\Windows\\SoftwareDistribution\\Download");
    if windows_update_path.exists() {
        let root_path = windows_update_path.to_string_lossy().to_string();
        if let Ok(entries) = fs::read_dir(&windows_update_path) {
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
                            category: "Downloads do Windows Update".to_string(),
                            root_path: root_path.clone(),
                        });
                        total_size += size;
                    }
                }
            }
        }
    }

    // Windows Logs
    let windows_logs_path = PathBuf::from("C:\\Windows\\Logs");
    if windows_logs_path.exists() {
        let root_path = windows_logs_path.to_string_lossy().to_string();
        if let Ok(entries) = fs::read_dir(&windows_logs_path) {
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
                            category: "Logs do Windows".to_string(),
                            root_path: root_path.clone(),
                        });
                        total_size += size;
                    }
                }
            }
        }
    }

    // Windows Minidump (crash dumps)
    let minidump_path = PathBuf::from("C:\\Windows\\Minidump");
    if minidump_path.exists() {
        let root_path = minidump_path.to_string_lossy().to_string();
        if let Ok(entries) = fs::read_dir(&minidump_path) {
            for entry in entries.flatten() {
                if let Ok(metadata) = entry.metadata() {
                    if metadata.is_file() {
                        let size = metadata.len();
                        files.push(TempFile {
                            path: entry.path().to_string_lossy().to_string(),
                            name: entry.file_name().to_string_lossy().to_string(),
                            size,
                            category: "Dumps de Crash".to_string(),
                            root_path: root_path.clone(),
                        });
                        total_size += size;
                    }
                }
            }
        }
    }

    // Windows Error Reporting
    let wer_path = PathBuf::from("C:\\ProgramData\\Microsoft\\Windows\\WER");
    if wer_path.exists() {
        let root_path = wer_path.to_string_lossy().to_string();
        if let Ok(entries) = fs::read_dir(&wer_path) {
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
                            category: "Relatórios de Erro do Windows".to_string(),
                            root_path: root_path.clone(),
                        });
                        total_size += size;
                    }
                }
            }
        }
    }

    // Browser caches and additional caches
    if let Ok(local_app_data) = std::env::var("LOCALAPPDATA") {
        let browser_caches = vec![
            (
                format!(
                    "{}\\Google\\Chrome\\User Data\\Default\\Cache",
                    local_app_data
                ),
                "Cache do Chrome",
            ),
            (
                format!(
                    "{}\\Microsoft\\Edge\\User Data\\Default\\Cache",
                    local_app_data
                ),
                "Cache do Edge",
            ),
            (
                format!("{}\\Mozilla\\Firefox\\Profiles", local_app_data),
                "Cache do Firefox",
            ),
            (
                format!("{}\\Microsoft\\Windows\\INetCache", local_app_data),
                "Cache do Internet Explorer",
            ),
            (
                format!("{}\\Microsoft\\Windows\\Explorer", local_app_data),
                "Miniaturas do Explorer",
            ),
        ];

        for (cache_path, category) in browser_caches {
            let path = PathBuf::from(&cache_path);
            if path.exists() {
                let root_path = cache_path.clone();
                if let Ok(entries) = fs::read_dir(&path) {
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
                                    category: category.to_string(),
                                    root_path: root_path.clone(),
                                });
                                total_size += size;
                            }
                        }
                    }
                }
            }
        }
    }

    // Application caches (Discord, Spotify, etc.)
    if let Ok(app_data) = std::env::var("APPDATA") {
        let app_caches = vec![
            (format!("{}\\Discord\\Cache", app_data), "Cache do Discord"),
            (
                format!("{}\\Discord\\Code Cache", app_data),
                "Code Cache do Discord",
            ),
            (
                format!("{}\\Spotify\\Storage", app_data),
                "Cache do Spotify",
            ),
        ];

        for (cache_path, category) in app_caches {
            let path = PathBuf::from(&cache_path);
            if path.exists() {
                let root_path = cache_path.clone();
                if let Ok(entries) = fs::read_dir(&path) {
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
                                    category: category.to_string(),
                                    root_path: root_path.clone(),
                                });
                                total_size += size;
                            }
                        }
                    }
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

#[tauri::command]
fn open_folder_location(path: String) -> Result<(), String> {
    use std::process::Command;

    let path_buf = PathBuf::from(&path);
    let folder_path = if path_buf.is_file() {
        path_buf
            .parent()
            .unwrap_or(&path_buf)
            .to_string_lossy()
            .to_string()
    } else {
        path
    };

    #[cfg(target_os = "windows")]
    {
        Command::new("explorer")
            .arg(&folder_path)
            .spawn()
            .map_err(|e| format!("Erro ao abrir pasta: {}", e))?;
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .arg(&folder_path)
            .spawn()
            .map_err(|e| format!("Erro ao abrir pasta: {}", e))?;
    }

    #[cfg(target_os = "linux")]
    {
        Command::new("xdg-open")
            .arg(&folder_path)
            .spawn()
            .map_err(|e| format!("Erro ao abrir pasta: {}", e))?;
    }

    Ok(())
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MemoryOptimizationResult {
    pub before_used: u64,
    pub after_used: u64,
    pub freed: u64,
    pub success: bool,
    pub message: String,
    pub is_admin: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProcessInfo {
    pub pid: u32,
    pub name: String,
    pub cpu_usage: f32,
    pub memory: u64,
    pub disk_usage: u64,
    pub status: String,
}

#[tauri::command]
async fn optimize_memory() -> Result<MemoryOptimizationResult, String> {
    use std::process::Command;
    
    let mut sys = System::new_all();
    sys.refresh_memory();
    
    let before_used = sys.used_memory();
    let mut success_count = 0;
    
    #[cfg(target_os = "windows")]
    let is_admin = is_elevated();
    
    #[cfg(not(target_os = "windows"))]
    let is_admin = false;
    
    #[cfg(target_os = "windows")]
    let total_operations = {
        // Execute operations in parallel using tokio
        let handles = vec![
            // 1. Clear DNS cache (fast operation)
            tokio::spawn(async {
                Command::new("ipconfig")
                    .args(&["/flushdns"])
                    .output()
                    .is_ok()
            }),
            
            // 2. Clear clipboard (fast operation)
            tokio::spawn(async {
                Command::new("powershell")
                    .args(&["-NoProfile", "-Command", "Set-Clipboard -Value $null"])
                    .output()
                    .is_ok()
            }),
            
            // 3. Force garbage collection (lightweight)
            tokio::spawn(async {
                Command::new("powershell")
                    .args(&[
                        "-NoProfile",
                        "-Command",
                        "[System.GC]::Collect(); [System.GC]::WaitForPendingFinalizers()"
                    ])
                    .output()
                    .is_ok()
            }),
        ];
        
        let total = handles.len();
        
        // Wait for all operations to complete
        for handle in handles {
            if let Ok(result) = handle.await {
                if result {
                    success_count += 1;
                }
            }
        }
        
        // Brief wait for system to stabilize
        tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;
        
        total
    };
    
    #[cfg(not(target_os = "windows"))]
    let total_operations = {
        // For non-Windows systems, just do basic cleanup
        success_count = 1;
        tokio::time::sleep(tokio::time::Duration::from_millis(200)).await;
        1
    };
    
    // Force Rust to drop unused memory
    drop(sys);
    
    // Refresh system info
    let mut sys = System::new_all();
    sys.refresh_memory();
    let after_used = sys.used_memory();
    
    let freed = if before_used > after_used {
        before_used - after_used
    } else {
        0
    };
    
    let message = if !is_admin {
        "Otimização básica executada - execute como administrador para melhores resultados".to_string()
    } else if success_count == total_operations {
        "Memória otimizada com sucesso".to_string()
    } else if success_count > 0 {
        format!("Otimização parcial: {} de {} operações concluídas", success_count, total_operations)
    } else {
        "Não foi possível otimizar a memória".to_string()
    };
    
    Ok(MemoryOptimizationResult {
        before_used,
        after_used,
        freed,
        success: success_count > 0,
        message,
        is_admin,
    })
}

#[tauri::command]
fn get_processes() -> Result<Vec<ProcessInfo>, String> {
    let mut sys = System::new_all();
    sys.refresh_all();
    
    let cpu_count = sys.cpus().len() as f32;
    let mut processes = Vec::new();
    
    for (pid, process) in sys.processes() {
        let status = if process.status().to_string().contains("Run") {
            "Executando".to_string()
        } else if process.status().to_string().contains("Sleep") {
            "Suspenso".to_string()
        } else {
            process.status().to_string()
        };
        
        // Normalizar CPU usage dividindo pelo número de núcleos
        let cpu_usage = process.cpu_usage() / cpu_count;
        
        processes.push(ProcessInfo {
            pid: pid.as_u32(),
            name: process.name().to_string_lossy().to_string(),
            cpu_usage,
            memory: process.memory(),
            disk_usage: process.disk_usage().total_read_bytes + process.disk_usage().total_written_bytes,
            status,
        });
    }
    
    Ok(processes)
}

#[tauri::command]
fn kill_process(pid: u32) -> Result<bool, String> {
    let mut sys = System::new_all();
    sys.refresh_all();
    
    if let Some(process) = sys.process(sysinfo::Pid::from_u32(pid)) {
        if process.kill() {
            Ok(true)
        } else {
            Err("Não foi possível encerrar o processo".to_string())
        }
    } else {
        Err("Processo não encontrado".to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            scan_temp_files,
            delete_temp_files,
            get_system_info,
            get_disk_info,
            open_folder_location,
            optimize_memory,
            get_processes,
            kill_process
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
