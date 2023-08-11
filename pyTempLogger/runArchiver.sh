#!/bin/bash
cd /home/suprdory/projects/piTempLog/pyTempLogger
source .venv/bin/activate
python  arxTempLog.py /net/projects/templog/data/temp_raspi.log
python  arxTempLog.py /net/projects/templog/data/temp_raspi2.log
python  arxTempLog.py /net/projects/templog/data/temp_pizero.log
python  arxTempLog.py /net/projects/templog/data/temp_audiopi.log
python  arxTempLog.py /net/projects/templog/data/temp_optitron.log

python  remove_bad_times.py /net/projects/templog/data/temp_raspi.log
python  remove_bad_times.py /net/projects/templog/data/temp_raspi2.log
python  remove_bad_times.py /net/projects/templog/data/temp_pizero.log
python  remove_bad_times.py /net/projects/templog/data/temp_audiopi.log
python  remove_bad_times.py /net/projects/templog/data/temp_optitron.log
