<<<<<<< HEAD
const validBody = (schema) => { 
    return (req, res, next) => {
        const validationResult = schema.validate(req.body, { abortEarly: false });
        if (validationResult.error) {
            return res.status(400).json({ errors:validationResult.error.details[0].message });
        }else{
            req.body = validationResult.value;
            next();
        }
    }
}

export {validBody}
=======
const validBody = (schema) =>{
  return(req, res, next) =>{
    const validationResult = schema.validate(req.body, {abortEarly: false});
    if(validationResult.error){
      return res.status(400).json({errors:validationResult.error.details});
    }else{
      req.body = validationResult.value;
      next();
    }
  };
};

export {validBody};
>>>>>>> f49765ccfe23a77bf44c5adf43c455fad53c1c73
