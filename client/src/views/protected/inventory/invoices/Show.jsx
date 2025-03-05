import { useState } from 'react'; 
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import useAxios from '@/utils/useAxios.jsx'; 
import Constants from '@/utils/Constants.jsx'; 
import swal from 'sweetalert2'; 
import {
    PayPalScriptProvider,
    usePayPalCardFields,
    PayPalCardFieldsProvider,
    PayPalButtons,
    PayPalNameField,
    PayPalNumberField,
    PayPalExpiryField,
    PayPalCVVField,
} from "@paypal/react-paypal-js"; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useInventoryInvoice } from '@/hooks/inventory/useInventoryInvoice.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Show() {
    const location = useLocation(); 
    const navigate = useNavigate(); 

    const axiosInstance = useAxios(); 

    const { id } = useParams(); 
    const { inventoryInvoice, getInventoryInvoice } = useInventoryInvoice(id); 
    const { createInventoryInvoice } = useInventoryInvoice(); 
    // console.log(inventoryInvoice); 

    /** PayPal logic */
    const [isPaying, setIsPaying] = useState(false);
    const initialOptions = {
        "client-id": `${Constants?.paypalClientID}`, 
        "enable-funding": "venmo",
        "disable-funding": "paylater",
        "buyer-country": "US",
        currency: "USD",
        "data-page-type": "product-details",
        components: "buttons,card-fields",
        "data-sdk-integration-source": "developer-studio",
    }; 

    const [billingAddress, setBillingAddress] =
        useState({
            addressLine1: "",
            addressLine2: "",
            adminArea1: "",
            adminArea2: "",
            countryCode: "",
            postalCode: "",
        });

    function handleBillingAddressChange(field, value) {
        setBillingAddress((prev) => ({
            ...prev,
            [field]: value,
        }));
    } 
    async function createOrder() {

        try {
            const response = await axiosInstance.post(
                `inventory/invoices/payment`, 
                {
                    invoice: inventoryInvoice?.data?._id, // The request body
                }, 
                {
                    headers: {
                        'Content-Type': 'application/json', 
                    }
                }
            );

            const orderData = response?.data; 
            console.log(orderData);

            if (orderData.id) {
                return orderData.id;
            } else {
                const errorDetail = orderData?.details?.[0];
                const errorMessage = errorDetail
                    ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                    : JSON.stringify(orderData);

                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error(error);
            if (error?.stack.startsWith('InvalidTokenError: Invalid token specified: must be a string') || error?.name == 'InvalidTokenError') {
                navigate(route('sign-in')); 
                swal.fire({ 
                    text: `You must be signed in to proceed!`, 
                    color: '#900000', 
                    width: 325, 
                    position: 'top', 
                    showConfirmButton: false
                }); 
            } else {
                swal.fire({ 
                    text: `Could not initiate PayPal Checkout!`, 
                    color: '#900000', 
                    width: 325, 
                    position: 'top', 
                    showConfirmButton: false
                }); 
                return `Could not initiate PayPal Checkout...${error}`;
            }
        }

    }

    async function onApprove(data, actions) { 
        try {
            const response = await axiosInstance.post(
                `inventory/invoices/payment/${data?.orderID}/capture`, 
                {}, // Empty body as it's a POST request without data payload 
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                }
            );

            const orderData = response?.data;

            // Three cases to handle:
            // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
            // (2) Other non-recoverable errors -> Show a failure message
            // (3) Successful transaction -> Show confirmation or thank you message

            const transaction =
                orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
                orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
            const errorDetail = orderData?.details?.[0];

            if (
                errorDetail ||
                !transaction ||
                transaction.status === "DECLINED"
            ) {
                // (2) Other non-recoverable errors -> Show a failure message
                let errorMessage;
                if (transaction) {
                    errorMessage = `Transaction ${transaction.status}: ${transaction.id}`; 
                    swal.fire({ 
                        text: errorMessage, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    }); 
                } else if (errorDetail) {
                    errorMessage = `${errorDetail.description} (${orderData.debug_id})`; 
                    swal.fire({ 
                        text: errorMessage, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    });
                } else {
                    errorMessage = JSON.stringify(orderData); 
                    swal.fire({ 
                        text: errorMessage, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    }); 
                }

                throw new Error(errorMessage);
            } else {
                // (3) Successful transaction -> Show confirmation or thank you message 
                // clearCart(); 
                navigate(route('home.inventory.invoices.index'));  
                console.log(
                    "Capture result",
                    orderData,
                    JSON.stringify(orderData, null, 2)
                ); 
                swal.fire({
                    text: `Transaction processed.`, 
                    color: '#f2f2f20', 
                    width: 325, 
                    position: 'top', 
                    showConfirmButton: false
                });
                return `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`;
            }
        } catch (error) {
            return `Sorry, your transaction could not be processed...${error}`;
        }

    }

    function onError(error) {
        /** Do something with the error from the SDK */  
        // navigate(route('sign-in')); 
        swal.fire({ 
            text: `Error processing payment!`, 
            color: '#900000', 
            width: 325, 
            position: 'top', 
            showConfirmButton: false
        })

    }
    /** End of PayPal logic */ 

    const [payWithCard, setPayWithCard] = useState((!location?.pathname?.endsWith('pay')) ? false : true); 

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">
                    <Link 
                        to={ route('home.inventory.index') } className="">Inventory</Link>&nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <path
                            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>&nbsp;
                    <Link 
                        to={ route('home.inventory.invoices.index') } className="">Invoices</Link>&nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <path
                            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>&nbsp;
                    {/* <span className="text-uppercase">#{ inventoryInvoice?.data?._id }</span> */}
                    <span className="">
                        { location?.pathname?.endsWith('pay') 
                            ? 'Pay' 
                            : 'View' }
                        &nbsp;Invoice
                    </span>
                </h2>
            </div>

            <section className="invoice pt-3">
                <h3 className="fs-6"><span className="fw-light text-uppercase">Invoice ID:&nbsp;</span>{ inventoryInvoice?.data?._id }</h3>

                <p className="pt-2"><small className="text-secondary">added by</small>&nbsp;
                    <span>{ ((inventoryInvoice?.data?.user?.first_name)?.slice(0,1)?.toUpperCase() + inventoryInvoice?.data?.user?.first_name?.slice(1))
                            + ' ' 
                            + ((inventoryInvoice?.data?.user?.last_name)?.slice(0,1)?.toUpperCase() + inventoryInvoice?.data?.user?.last_name?.slice(1)) }</span>,&nbsp;
                    <span>{ dayjs.utc(inventoryInvoice?.data?.user?.created_at).fromNow() }</span>
                </p>

                <section className={ (inventoryInvoice?.data?.notes) ? 'notes pt-2' : 'notes pt-1' }>
                    <h4 className="fs-6 fw-light">Notes:&nbsp;</h4>
                    <div 
                        className="preview fs-6" 
                        dangerouslySetInnerHTML={{ __html: (inventoryInvoice?.data?.notes) }} />
                </section>

                <section className="d-flex align-items-center gap-3">
                    <div>
                        { (inventoryInvoice?.data?.paid_at) 
                            ? <span>Amount Paid:</span>
                            : <span>Amount Payable:</span>}
                        &nbsp;
                        <span className="fw-bold fs-4">
                            {(inventoryInvoice?.data?.products?.reduce((total, product) => {
                                return total + Number(product?.inventory_product_unit?.amount_purchased || 0);
                            }, 0))?.toFixed(2)}&nbsp;<span className="fs-6">MUR</span>
                        </span>
                    </div>
                    { ((!payWithCard) && (!inventoryInvoice?.data?.paid_at)) && (
                        <div>
                            <button 
                                onClick={ () => {
                                    setPayWithCard(!payWithCard); 
                                } }
                                className="btn btn-sm btn-outline-secondary border-radius-25 fw-bold fs-6 px-3">Pay&nbsp;
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-credit-card-fill" viewBox="0 0 16 16">
                                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0zm0 3v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7zm3 2h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1"/>
                                </svg>
                            </button>
                        </div>
                    ) }
                    
                </section>

                <section className="d-flex flex-column justify-content-center align-items-start flex-wrap gap-4" style={{ maxWidth: '600px' }}> 

                    { (inventoryInvoice?.loading == false) && (
                        <PayPalScriptProvider options={initialOptions}>
                            { (payWithCard) && (
                                <div className="w-100 d-flex justify-content-end">
                                    <span 
                                        type="button" 
                                        onClick={ () => setPayWithCard(false) }>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                        </svg>
                                    </span>
                                </div>
                            ) } 

                            { (payWithCard) && 
                                <PayPalCardFieldsProvider
                                    createOrder={createOrder}
                                    onApprove={onApprove}
                                    style={{
                                        input: { 
                                            "font": "inherit", 
                                            "font-size": "16px",
                                            "font-family": "Montserrat, sans-serif", 
                                            // "font-family": "courier, monospace",
                                            "font-weight": "lighter",
                                            color: "#000", 
                                            "border-radius": "35px", 
                                            "padding-left": "1.75rem", 
                                            "padding-right": "1.75rem", 
                                        },
                                        ".invalid": { color: "purple" },
                                    }}
                                >
                                    {/* <PayPalNameField
                                        style={{
                                            input: { color: "blue" },
                                            ".invalid": { color: "purple" },
                                        }}
                                    /> */}
                                    <PayPalNameField />
                                    <PayPalNumberField />
                                    <PayPalExpiryField />
                                    <PayPalCVVField />
                                    
                                    
                                    {/* Custom client component to handle card fields submission */}
                                    <SubmitPayment
                                        isPaying={isPaying}
                                        setIsPaying={setIsPaying}
                                        // billingAddress={
                                        //     billingAddress
                                        // } 
                                    />
                                </PayPalCardFieldsProvider> 
                            }

                        </PayPalScriptProvider> 
                    ) }

                </section>

                { (inventoryInvoice?.data?.products?.length>0) && (
                    <section className="product-units pt-4">
                        <h4 className="fs-5">Invoice Items:&nbsp;&nbsp;</h4>
                        <ul className="list-unstyled pt-1">
                            { inventoryInvoice?.data?.products?.map((item, index) => (
                                <li key={index} className="product-unit py-3 d-flex border-top border-bottom">
                                    <span>{ index+1 }.&nbsp;</span>

                                    <div className="d-flex flex-column">
                                        <p className="mb-0">Product Name:&nbsp;<span className="fw-semibold">{ item?.inventory_product_unit?.inventory_product?.name }</span></p>
                                        { (item?.inventory_product_unit?.product_number) && (
                                            <p className="mb-0">Product Number:&nbsp;<span className="fw-semibold">{ item?.inventory_product_unit?.product_number }</span></p>
                                        ) }
                                        <p className="mb-0">Amount Purchased:&nbsp;
                                            <span className="fw-semibold">
                                                { item?.inventory_product_unit?.amount_purchased ? Number(item?.inventory_product_unit?.amount_purchased)?.toFixed(2) : Number(0) } MUR
                                            </span>
                                        </p>
                                        { (item?.inventory_product_unit?.manufacture_date) && (
                                            <p className="mb-0">Manufacture Date:&nbsp;
                                                <span className="fw-semibold">{ dayjs(item?.inventory_product_unit?.manufacture_date).format('ddd, MMM D, YYYY h:mm A') }</span>
                                            </p>
                                        ) }
                                        { (item?.inventory_product_unit?.expiration_date) && (
                                            <p className="mb-0">Expiration Date:&nbsp;
                                                <span className="fw-semibold">{ dayjs(item?.inventory_product_unit?.expiration_date).format('ddd, MMM D, YYYY h:mm A') }</span>
                                            </p>
                                        ) }
                                    </div>

                                    { (!inventoryInvoice?.data?.paid_at) && (
                                        <div className="ms-3">
                                            <span 
                                                onClick={ () => {
                                                    swal.fire({
                                                        text: "Are you sure you want to delete this?", 
                                                        showCancelButton: true,
                                                        confirmButtonColor: "#FF0000",
                                                        cancelButtonColor: "#414741",
                                                        confirmButtonText: "Yes!", 
                                                        cancelButtonText: "No!", 
                                                        customClass: {
                                                            confirmButton: 'swal2-confirm-button', 
                                                            cancelButton: 'swal2-cancel-button'
                                                        }, 
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            deleteInventoryProductUnit(item?._id); 
                                                            // setInventoryProducts([]);
                                                            getInventoryProduct(id); 
                                                        }
                                                    });
                                                }} 
                                                className="cursor-pointer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill text-danger" viewBox="0 0 16 16">
                                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                    </svg>
                                            </span>
                                        </div>
                                    ) }
                                </li>
                            )) }
                        </ul>
                    </section>
                )}
            </section>
        </Layout>
    )
}


const SubmitPayment = ({ isPaying, setIsPaying, billingAddress }) => {
    const { cardFieldsForm, fields } = usePayPalCardFields();

    const handleClick = async () => {
        if (!cardFieldsForm) {
            const childErrorMessage = "Unable to find any child components in the <PayPalCardFieldsProvider />";

            throw new Error(childErrorMessage); 
        }
        const formState = await cardFieldsForm.getState();

        if (!formState.isFormValid) {
            return alert("The payment form is invalid"); 
        }
        setIsPaying(true); 

        cardFieldsForm.submit({ billingAddress }).catch((err) => {
            setIsPaying(false);
        });
    };

    return (
        <button
            className={isPaying ? "btn border-radius-35 mt-3 me-2 px-4" : "btn btn-outline-secondary border-radius-35 mt-3 me-2 px-4 fw-semibold"}
            style={{ float: "right" }}
            onClick={ handleClick }
        >
            {isPaying 
                // ? <div className="spinner tiny" /> 
                ? <div className="spinner-grow" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                : "Pay Now"}
        </button>
    );
};