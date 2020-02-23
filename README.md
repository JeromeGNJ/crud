# crud - Nodejs, Express, MongoDB cloud

Run nodemon server.js

Goto "http://localhost:3000/employee/" for Create employee page view

Add/Update pages are made in same view.

Photos are saved as base64 in Mongodb


## API Documentation 

Create Employee Name = 'employee_name' ~ string 
Salary = 6000 ~ integer 
DOB = 'dd-mm-yyyy' 
Skills = JSON object All paranmeters seperated by ‘&’ 

Request parameters: 
http://localhost:3000/employee/api/create/'employee_name'&6000&'20-02- 2020'&{python:'checked',NodeJS:'checked',Angular:'checked',R:'checked',Javascript:' checked',HTML:'checked',CSS:'checked',Java:'checked',React:'checked',Kotlin:'checke d'} 

Example: with one skill 

http://localhost:3000/employee/api/create/'employee_name'&6000&'20-02- 2020'&{python:'checked'} 

Read Employees 

List all 
http://localhost:3000/employee/api/list 

Get User 
http://localhost:3000/employee/api/get_user/{id} 

Search user by name (fuzzy search) 
http://localhost:3000/employee/api/search/{search_term} 

Update id = employee_ id_number 
Name = employee_name 
Salary = 6000 ~ integer 
DOB = 'dd-mm-yyyy' 
Skills = JSON object

All paranmeters seperated by ‘&’ 

Request parameters: 
http://localhost:3000/employee/api/update/'employee_name'&6000&'20-02- 2020'&{python:'checked',NodeJS:'checked',Angular:'checked',R:'checked',Javascript:' checked',HTML:'checked',CSS:'checked',Java:'checked',React:'checked',Kotlin:'checke d'} Delete Employee http://localhost:3000/employee/api/delete/{id}
