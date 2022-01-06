import psutil, datetime, time
#from gpiozero import CPUTemperature

def job():
	#cpu_temp_gpio=str(CPUTemperature().temperature)

	cpu_temp=str(psutil.sensors_temperatures()['cpu_thermal'][0].current)
	current_time=str(datetime.datetime.now())
	ostr=current_time + ', ' + cpu_temp + '\n'
#	print(ostr)
	with open("/net/projects/templog/data/temp_raspi.log", "a") as myfile:
    		myfile.write(ostr)


while True:
	job()
	time.sleep(15)
