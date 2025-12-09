async function dashboard(req,res) {
    try{
    res.json({message: "Welcome to Dashboard"})
    }
    catch(error){
        res.status(500).json({ message: err.message });
    }
}


module.exports  = dashboard;