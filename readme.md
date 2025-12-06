# DevTinder APIs

authRouter
- POST/signup
- POST/login
- POST/logout

profileRouter
- GET/profile/view
- PATCH/profile/edit
- PATCH/profile/password

connectionRequestRouter
- POST/request/send/:status/:userId //for both interested and ignored
- POST/request/review/accepted/:requestId
- POST/request/review/rejected/:requestId
-//instead of creating this 2 api we can create one apo
- POST/request/review/:status/:requestId   //for both accepted and rejected

userRouter
- GET/user/connections
- GET/user/requests
- GET/user/feed - Gets you the profiles of other users on platform


Status:ignored,interested,accepted,rejected