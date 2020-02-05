CREATE USER 'kotoba'@'localhost' IDENTIFIED BY 't61kvg90';
GRANT ALL PRIVILEGES ON kotoba.* TO 'kotoba'@'localhost';
FLUSH PRIVILEGES;
create schema kotoba;
mysql -u kotoba -p kotoba < kotoba.sql
mysql -u kotoba -p kotoba
SHOW schemas;
USE kotoba;
SHOW tables;
sudo apt-get install libapache2-mod-php7.2
sudo dpkg -S php7 | grep libapache2-mod-php7;
sudo a2dismod mpm_event && sudo a2enmod mpm_prefork && sudo a2enmod php7.2
sudo service apache2 reload
echo '<FilesMatch \.php$>
     ​SetHandler application/x-httpd-php
​     </FilesMatch>'
sudo vim /etc/apache2/apache2.conf
