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

Pagination

/feed?page=1&limit=10=> 1-10 => skip(0) & .limit(10)
/feed? page=2&limit=10=> 11-20  => skip(10) & .limit(10)
/feed? page=3&limit=10=> 21-30  => skip(20) & .limit(10)


skip=(page-1)*limit