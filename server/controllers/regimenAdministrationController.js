import asyncHandler from 'express-async-handler'; 
import Regimen from '../models/Regimen.js'; 
import RegimenAdministration from '../models/RegimenAdministration.js'; 


/**
 * Get Regimen Administrations
 */ 
const getRegimenAdministrations = asyncHandler(async (req, res) => {

}); 

/**
 * Create Regimen Administration
 */ 
const createRegimenAdministration = asyncHandler(async (req, res) => {
    const { user, regimen, proposed_administration_date_time } = req?.body; 

    const regimenAdministration = new RegimenAdministration({
        user, regimen, proposed_administration_date_time
    }); 

    regimenAdministration.save()
                        .then(() => {
                            res.status(201).json({ success: `Regimen Administration ${regimenAdministration?._id} created` });
                        })
                        .catch(error => {
                            return res.status(400).json({ message: "An error occured", details: `${error}` });
                        });
}); 

/**
 * Get Regimen Administration
 */
const getRegimenAdministration = asyncHandler(async (req, res) => {
    const regimenAdministration = await RegimenAdministration.findOne({ _id: req?.params?.id, deleted_at: null }).lean(); 

    if (!regimenAdministration) return res.status(404).json({ message: "Regimen Administration not found!" }); 

    res.json({ data: regimenAdministration });
}); 

/**
 * Update Regimen Administration
 */
const updateRegimenAdministration = asyncHandler(async (req, res) => {
    const regimenAdministration = await RegimenAdministration.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!regimenAdministration) return res.status(404).json({ message: "Regimen Administration not found!" }); 

    // regimenAdministration.user = req?.body?.user || regimenAdministration?.user; 
    // regimenAdministration.regimen = req?.body?.regimen || regimenAdministration?.regimen; 
    regimenAdministration.proposed_administration_time = req?.body?.proposed_administration_time || regimenAdministration?.proposed_administration_time; 
    regimenAdministration.administered = req?.body?.administered || regimenAdministration?.administered; 
    regimenAdministration.administration_date_time = req?.body?.administration_date_time || regimenAdministration?.administration_date_time; 
    regimenAdministration.comment = req?.body?.comment || regimenAdministration?.comment; 

    regimenAdministration.save()
                        .then(() => {
                            res.json({ success: `Regimen Administration ${regimenAdministration?._id} updated` });
                        })
                        .catch(error => {
                            return res.status(400).json({ message: "An error occured", details: `${error}` });
                        }); 
}); 

/**
 * Soft-delete Regimen Administration
 */
const deleteRegimenAdministration = asyncHandler(async (req, res) => {
    const regimenAdministration = await RegimenAdministration.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!regimenAdministration) return res.status(404).json({ message: "Regimen Administration not found!" }); 

    if (regimenAdministration.deleted_at == '' || regimenAdministration.deleted_at == null) {
        regimenAdministration.deleted_at = new Date().toISOString();
        regimenAdministration.deleted_by = req?.user_id;
    }

    regimenAdministration.save()
                        .then(() => {
                            res.json({ success: `Regimen Administration ${regimenAdministration?._id} deleted` });
                        })
                        .catch(error => {
                            return res.status(400).json({ message: "An error occured", details: `${error}` });
                        }); 
}); 

/**
 * Restore soft-deleted Regimen Administration
 */
const restoreRegimenAdministration = asyncHandler(async (req, res) => {
    const regimenAdministration = await RegimenAdministration.findOne({ _id: req?.params?.id, deleted_at: { $ne: null } }); 

    if (!regimenAdministration) return res.status(404).json({ message: "Regimen Administration not found!" }); 

    regimenAdministration.deleted_at = null;
    regimenAdministration.deleted_by = null;

    regimenAdministration.save()
                        .then(() => {
                            res.json({ success: `Regimen Administration ${regimenAdministration?._id} restored` });
                        })
                        .catch(error => {
                            return res.status(400).json({ message: "An error occured", details: `${error}` });
                        }); 
}); 

/**
 * Permanent-delete Regimen Administration
 */
const destroyRegimenAdministration = asyncHandler(async (req, res) => {
    const regimenAdministration = await RegimenAdministration.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!regimenAdministration) return res.status(404).json({ message: "Regimen Administration not found!" }); 

    regimenAdministration.deleteOne()
                        .then(() => {
                            res.json({ success: `Regimen Administration ${regimenAdministration?._id} deleted permanently` });
                        })
                        .catch(error => {
                            return res.status(400).json({ message: "An error occured", details: `${error}` });
                        });
}); 


export { getRegimenAdministrations, 
        createRegimenAdministration, 
        getRegimenAdministration, 
        updateRegimenAdministration, 
        deleteRegimenAdministration, 
        restoreRegimenAdministration, 
        destroyRegimenAdministration }; 