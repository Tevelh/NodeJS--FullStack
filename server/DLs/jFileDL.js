const jFile = require("jsonfile");

const readData = (path) => 
{
    try
    {
        return jFile.readFile(path);
    }
    catch(error)
    {
        return "Error with reading data" + error.message;
    }
}

const saveData = async (path, data) =>
{
    try
    {
        await jFile.writeFile(path, data);
        return "Data saved successfully";
    }
    catch(error)
    {
         return "Error with saving" + error.message;
    }
}

module.exports = 
{
    readData,
    saveData
}