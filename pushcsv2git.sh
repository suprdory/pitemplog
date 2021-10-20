#/bin/bash
cd /home/suprdory/projects/webplotter
#git add temp0.csv temp.csv temp2.csv temp3.csv
git add temp_raspi_1min.csv temp_raspi2_1min.csv temp_pizero_1min.csv temp_audiopi_1min.csv
git commit -m 'cron push'
git push
