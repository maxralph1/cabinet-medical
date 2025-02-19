import asyncHandler from 'express-async-handler'; 
import InventoryInvoice from '../../models/inventory/InventoryInvoice.js'; 
import InventoryProductInvoice from '../../models/inventory/inventoryProductInvoice.js';
import InventoryProductUnit from '../../models/inventory/InventoryProductUnit.js';


/**
 * Get Inventory Invoices
 */
const getInventoryInvoices = asyncHandler(async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 
    const rangeQuery = req?.query?.range; 
    const searchQuery = req?.query?.search; 

    let inventoryInvoices, inventoryInvoicesCount;

    if (searchQuery) {
        inventoryInvoices = await InventoryInvoice.find({ name: new RegExp(searchQuery, 'i'), deleted_at: null })
                                                .sort('-created_at')
                                                .lean();
    } else if (!searchQuery) {
        if (rangeQuery != 'all') {
            inventoryInvoices = await InventoryInvoice.find({ payment_status: rangeQuery, 
                                                            deleted_at: null })
                                                    .sort('-created_at')
                                                    .skip(skip)
                                                    .limit(limit)
                                                    .lean(); 
            inventoryInvoicesCount = await InventoryInvoice.countDocuments({ payment_status: rangeQuery, 
                                                                            deleted_at: null });
        } else if (rangeQuery == 'all' || !roleQuery) {
            inventoryInvoices = await InventoryInvoice.find({ deleted_at: null })
                                                    .sort('-created_at')
                                                    .skip(skip)
                                                    .limit(limit)
                                                    .lean(); 
            inventoryInvoicesCount = await InventoryInvoice.countDocuments({ deleted_at: null });
        }
    }

    if (!inventoryInvoices?.length) return res.status(404).json({ message: "No inventory invoices found!" }); 

    const total = await InventoryInvoice.countDocuments({ deleted_at: null }); 

    let inventoryInvoiceList = []; 

    const updateInventoryInvoicePromises = inventoryInvoices?.map(async inventoryInvoiceItem => { 
        /** Inventory Invoices */
        let foundInventoryProductInvoices = await InventoryProductInvoice.find({ inventory_invoice: inventoryInvoiceItem?._id })
                                                                            .populate({
                                                                                path: 'user',
                                                                                select: 'first_name last_name username'
                                                                            })
                                                                            .populate({
                                                                                path: 'inventory_product_unit',
                                                                                populate: {
                                                                                    path: 'inventory_product', 
                                                                                }
                                                                            })
                                                                            .lean(); 
        inventoryInvoiceItem['products'] = foundInventoryProductInvoices; 
        /** End of Product Invoices */

        inventoryInvoiceList.push(inventoryInvoiceItem); 
    }); 

    await Promise.all(updateInventoryInvoicePromises); 

    res.json({ meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(inventoryInvoicesCount / limit), 
                    total_results: inventoryInvoicesCount
                }, 
                data: inventoryInvoices });
}); 

/**
 * Create Inventory Invoice
 */
const createInventoryInvoice = asyncHandler(async (req, res) => {
    const { products, notes } = req?.body; 

    console.log('products:', products);

    const inventoryInvoice = new InventoryInvoice({
        user: req?.user_id,  
        notes
    }); 

    /** Products */
    if (products) {
        // const products_array = JSON.parse(products); 
        const products_array = products.split(','); 
        console.log('products array:', products_array); 
        const productsResolve = products_array?.map(async (unit, index) => { 
            const randomInventoryProductUnit = await InventoryProductUnit.findOne({
                inventory_product: unit, 
                // expiration_date: { $gt: new Date(new Date().toISOString()) }, 
                disbursed: false 
            }).sort({ expiration_date: 1 }).lean(); 

            console.log('randon unit:', randomInventoryProductUnit); 

            await InventoryProductInvoice.create({
                user: req?.user_id, 
                inventory_product_unit: randomInventoryProductUnit?._id, 
                inventory_invoice: inventoryInvoice?._id
            }); 
        }); 

        await Promise.all(productsResolve); 
    }
    /** End of Products */

    inventoryInvoice.save()
                    .then(() => {
                        res.status(201).json({ success: `Inventory Invoice ${inventoryInvoice?._id} created` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 

/**
 * Get Inventory Invoice
 */
const getInventoryInvoice = asyncHandler(async (req, res) => {
    const inventoryInvoice = await InventoryInvoice.findOne({ _id: req?.params?.id, deleted_at: null })
                                                    .populate({
                                                        path: 'user',
                                                        select: 'first_name last_name username'
                                                    })
                                                    .lean(); 

    if (!inventoryInvoice) return res.status(404).json({ message: "Inventory Invoice not found!" }); 

    const products = await InventoryProductInvoice.find({ inventory_invoice: inventoryInvoice?._id })
                                                    .sort('-created_at')
                                                    .populate({
                                                        path: 'user',
                                                        select: 'first_name last_name username'
                                                    })
                                                    .populate({
                                                        path: 'inventory_product_unit',
                                                        populate: {
                                                            path: 'inventory_product', 
                                                        }
                                                    })
                                                    .lean(); 

    let inventoryInvoiceObj = inventoryInvoice; 

    inventoryInvoiceObj.products = products; 

    res.json({ data: inventoryInvoiceObj }); 
}); 

/**
 * Update Inventory Invoice
 */
const updateInventoryInvoice = asyncHandler(async (req, res) => {
    const inventoryInvoice = await InventoryInvoice.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!inventoryInvoice) return res.status(404).json({ message: "Inventory Invoice not found!" }); 

    inventoryInvoice.user = req?.body?.user || inventoryInvoice?.user; 
    inventoryInvoice.name = req?.body?.name || inventoryInvoice?.name; 
    inventoryInvoice.description = req?.body?.description || inventoryInvoice?.description; 

    inventoryInvoice.save()
                    .then(() => {
                        res.json({ success: `Inventory Invoice ${inventoryInvoice?._id} updated` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 

/**
 * Soft-delete Inventory Invoice
 */
const deleteInventoryInvoice = asyncHandler(async (req, res) => {
    const inventoryInvoice = await InventoryInvoice.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!inventoryInvoice) return res.status(404).json({ message: "Inventory Invoice not found!" }); 

    if (inventoryInvoice.deleted_at == '' || inventoryInvoice.deleted_at == null) {
        inventoryInvoice.deleted_at = new Date().toISOString();
        inventoryInvoice.deleted_by = req?.user_id;
    }

    inventoryInvoice.save()
                    .then(() => {
                        res.json({ success: `Inventory Invoice ${inventoryInvoice?._id} deleted` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 

/**
 * Restore soft-deleted Inventory Invoice
 */
const restoreInventoryInvoice = asyncHandler(async (req, res) => {
    const inventoryInvoice = await InventoryInvoice.findOne({ _id: req?.params?.id, deleted_at: { $ne: null } }); 

    if (!inventoryInvoice) return res.status(404).json({ message: "Inventory Invoice not found!" }); 

    inventoryInvoice.deleted_at = null;
    inventoryInvoice.deleted_by = null;

    inventoryInvoice.save()
                    .then(() => {
                        res.json({ success: `Inventory Invoice ${inventoryInvoice?._id} restored` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 

/**
 * Permanent-delete Inventory Invoice
 */
const destroyInventoryInvoice = asyncHandler(async (req, res) => {
    const inventoryInvoice = await InventoryInvoice.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!inventoryInvoice) return res.status(404).json({ message: "Inventory Invoice not found!" }); 

    inventoryInvoice.deleteOne()
                    .then(() => {
                        res.json({ success: `Inventory Invoice ${inventoryInvoice?._id} deleted permanently` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    });
}); 


export { getInventoryInvoices, 
        createInventoryInvoice, 
        getInventoryInvoice, 
        updateInventoryInvoice, 
        deleteInventoryInvoice, 
        restoreInventoryInvoice, 
        destroyInventoryInvoice }; 