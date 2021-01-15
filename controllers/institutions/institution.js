import Institution from '../../models/institution'

const addInstitution = async (req,res) => {
    try {
        const institutionDb = await Institution.create(req.body)
        return res.json(institutionDb)
    } catch (error) {
        return res.status(400).json({
            mensaje: "Ocurrio un error",
            error
        })
    }
}

const getInstitutions = async (req,res) => {
    try {
        const institutionDb = await Institution.find();
        return res.json(institutionDb)
    } catch (error) {
        return res.status(400).json({
            mensaje: "Ocurrio un Error",
            error
        })
    }    
}

const updateInstitution = async (req, res) =>{
    const _id = req.params.id;
    const body = req.body;
    
    try {
      const institutionDb = await Institution.findByIdAndUpdate(
        _id,
        body,
        {new: true}
      );
      res.status(200).json(institutionDb)
    } catch (error) {
      res.status(400).json({
        mensaje : "Ocurrio un error",
        error
      })
    }
  }

  const deleteInstitutions = async(req, res) => {
    const ids = req.body;
    try {
      await Institution.deleteMany(
        {
          _id: {$in: ids},
        })
      res.status(200).json({mensaje: "Instituciones Borrados Exitosamente"});  
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  };

module.exports = {addInstitution, getInstitutions, updateInstitution, deleteInstitutions}