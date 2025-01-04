# PROJECT GENIUS API DOCUMENTATION

**BaseUrl** = *https://project-genius-back-end.onrender.com/users*  
**All POST, PATCH, PUT uses header `Content-Type: application/json`**

## <span style="color:blue"> Sign Up Flow Endpoint</span>


- ### <span style="color: green"> POST</span> SignUp Initiation
    - **Method**: `POST`
    - **URL**: `BaseUrl/users`
    - **Description** : Initiate Sign Up

    - **Body**: 
        ```javascript
        {
            email,
            password,
        }
        ```
    - **Return**:
        - _<span style="color: green">Success</span>_   
        | Status Code   | Response Body                                       |  
        | :------------ | --------------------------------------------------- |  
        | 200           | `{ "message": "Verify email to complete Sign Up" }` |  


