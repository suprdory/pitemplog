#/bin/bash
dir=~/projects/webplotter/
python3 downsample_templog.py ${dir}temp.csv ${dir}temp_raspi_1min.csv
python3 downsample_templog.py ${dir}temp2.csv ${dir}temp_raspi2_1min.csv
python3 downsample_templog.py ${dir}temp0.csv ${dir}temp_pizero_1min.csv
python3 downsample_templog.py ${dir}temp3.csv ${dir}temp_audiopi_1min.csv