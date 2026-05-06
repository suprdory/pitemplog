import psutil, datetime, time
#from gpiozero import CPUTemperature

	#cpu_temp_gpio=str(CPUTemperature().temperature)
	# cpu_temp=str(psutil.sensors_temperatures()['cpu_thermal'][0].current)
cpu_temp=str(psutil.sensors_temperatures()['pch_skylake'][0].current)
current_time=str(datetime.datetime.now())
ostr=current_time + ', ' + cpu_temp + '\n'
#	print(ostr)
with open("/home/suprdory/data/templog/temp_optitron.log", "a") as myfile:
	myfile.write(ostr)
