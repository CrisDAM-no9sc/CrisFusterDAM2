import psutil

cpu_load_per_core = psutil.cpu_percent(interval=1, percpu=True)
total_cpu_load = psutil.cpu_percent(interval=1)

print(f"Carga de CPU por nuecleo: {cpu_load_per_core}")
print(f"Total CPU cargada: {total_cpu_load}%")