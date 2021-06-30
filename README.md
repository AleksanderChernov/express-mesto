# Проект Mesto фронтенд + бэкенд
В данный момент можно найти по адресу https://ancherproject.nomoredomains.club/sign-up

# Функциональность
Можно регистрироваться, авторизовываться, все валидируется при помощи Joi, изменять личную информацию.  
Однако главное это возможность создавать карточки фотографий с названием и удалять (если вы автор), лайкать/дизлайкать.

# Технологии:
-React  
-БЭМ  
-Mongo  
-Express.js  
-Mongoose  
-Joi  

# Планы:
-Получить доступ к Монго на сервере  
-Исправить баги верстки  
-Есть моменты где необходим setTimeout()  


# Развертывание:  
-Cклонируйте репозиторий  
-В консоли установите зависимости: npm i  
-Если будeтe дополнять, то следующая команда npm run start  
-Если просто протестить тогда npm run build, появится папка build, там все скомпилировано  
-Сейчас все завязано на мой API, но если он не будет работать то просто смените запросы на localhost:xxxx, где хxxx это нужный вам порт, не забудьте сделать этот шаг и в бэкенде, необходимо сменить порт на котором работает cors 
