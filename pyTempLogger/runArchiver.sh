#!/bin/bash
cd /hdd/userdata/suprdory/projects/piTempLog/pyTempLogger
source .venv/bin/activate
python  arxTempLog.py /home/suprdory/data/templog/temp_raspi.log
python  arxTempLog.py /home/suprdory/data/templog/temp_raspi2.log
python  arxTempLog.py /home/suprdory/data/templog/temp_pizero.log
python  arxTempLog.py /home/suprdory/data/templog/temp_audiopi.log
python  arxTempLog.py /home/suprdory/data/templog/temp_optitron.log

python  remove_bad_times.py /home/suprdory/data/templog/temp_raspi.log
python  remove_bad_times.py /home/suprdory/data/templog/temp_raspi2.log
python  remove_bad_times.py /home/suprdory/data/templog/temp_pizero.log
python  remove_bad_times.py /home/suprdory/data/templog/temp_audiopi.log
python  remove_bad_times.py /home/suprdory/data/templog/temp_optitron.log
