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
import { useMedicalBill } from '@/hooks/useMedicalBill.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Show() {
    const location = useLocation(); 
    const navigate = useNavigate(); 

    const axiosInstance = useAxios(); 

    const { id } = useParams(); 
    const { medicalBill, getMedicalBill } = useMedicalBill(id); 
    const { createMedicalBill } = useMedicalBill(); 
    console.log(medicalBill); 

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
                `medical-bills/payment`, 
                {
                    medicalBill: medicalBill?.data?._id, 
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
                `medical-bills/payment/${data?.orderID}/capture`, 
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
                navigate(route('home.medical-bills.index'));  
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
                        to={ route('home.medical-bills.index') } className="">Medical Bills</Link>&nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <path
                            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>&nbsp;
                    <span className="">
                        {/* { location?.pathname?.endsWith('pay') 
                            ? 'Pay' 
                            : 'View' } */}
                        { medicalBill?.data?.fully_paid == false 
                            ? 'Pay' 
                            : 'View' }
                        &nbsp;Medical Bill
                    </span>
                </h2>
            </div>

            <section className="invoice pt-3">
                <h3 className="fs-6"><span className="fw-light text-uppercase">Invoice ID:&nbsp;</span>{ medicalBill?.data?._id }</h3>

                <p className="pt-2"><small className="text-secondary">added by</small>&nbsp;
                    <span>{ ((medicalBill?.data?.authorizing_professional?.first_name)?.slice(0,1)?.toUpperCase() + medicalBill?.data?.authorizing_professional?.first_name?.slice(1))
                            + ' ' 
                            + ((medicalBill?.data?.authorizing_professional?.last_name)?.slice(0,1)?.toUpperCase() + medicalBill?.data?.authorizing_professional?.last_name?.slice(1)) }</span>,&nbsp;
                    <span style={{ fontSize: 'small' }}>{ dayjs.utc(medicalBill?.data?.authorizing_professional?.created_at).fromNow() }</span>
                </p>

                <p className="pt-2"><small className="text-secondary">Patient:</small>&nbsp;
                    <span>{ ((medicalBill?.data?.patient?.first_name)?.slice(0,1)?.toUpperCase() + medicalBill?.data?.patient?.first_name?.slice(1))
                            + ' ' 
                            + ((medicalBill?.data?.patient?.last_name)?.slice(0,1)?.toUpperCase() + medicalBill?.data?.patient?.last_name?.slice(1)) }</span>
                </p>

                <section className={ (medicalBill?.data?.notes) ? 'notes pt-2' : 'notes pt-1' }>
                    <h4 className="fs-6 fw-light text-secondary mb-0">Notes:&nbsp;</h4>
                    <div 
                        className="preview fs-6" 
                        dangerouslySetInnerHTML={{ __html: (medicalBill?.data?.notes) }} />
                </section>

                <section className={ (medicalBill?.data?.comments) ? 'comments pt-2' : 'comments pt-1' }>
                    <h4 className="fs-6 fw-light text-secondary mb-0">Comments:&nbsp;</h4>
                    <div 
                        className="preview fs-6" 
                        dangerouslySetInnerHTML={{ __html: (medicalBill?.data?.comments) }} />
                </section>

                <section className="d-flex align-items-center gap-3">
                    <div>
                        { (medicalBill?.data?.fully_paid_on) 
                            ? <span className="text-secondary">Amount Paid:</span>
                            : <span className="text-secondary">Amount Payable:</span>}
                        &nbsp;
                        <span className="fw-bold fs-4">
                            { medicalBill?.data?.amount ? (medicalBill?.data?.amount)?.toFixed(2) : '0.00'}&nbsp;<span className="fs-6">MUR</span>
                        </span>
                    </div>
                    { ((!payWithCard) && (!medicalBill?.data?.fully_paid_on)) && (
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

                    { (medicalBill?.loading == false) && (
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