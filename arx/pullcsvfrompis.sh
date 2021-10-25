#/bin/bash
dir=~/projects/webplotter/
rsync suprdory@raspi2:projects/templog/temp2.csv ${dir}
rsync suprdory@192.168.1.230:projects/templog/temp3.csv ${dir}
#rsync suprdory@pizero:projects/templog/temp0.csv ${dir}
${dir}process_templogs.sh
