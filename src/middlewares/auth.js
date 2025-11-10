const adminAuth=(req, res, next) => {
    console.log("Admin auth is getting checked mmalik!");
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    
    if (!isAdminAuthorized) {
        return res.status(401).send("unauthorized request");
    }
    else{
        next();
    }
    
};

const userAuth=(req, res, next) => {
    console.log("user auth is getting checked mmalik!");
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    
    if (!isAdminAuthorized) {
        return res.status(401).send("unauthorized request");
    }
    else{
        next();
    }
    
};

module.exports={
    adminAuth,
    userAuth,
}