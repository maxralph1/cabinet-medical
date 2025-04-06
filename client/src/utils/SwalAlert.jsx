import swal from 'sweetalert2';


const SwalAlert = (type, status, message) => {
    swal.fire({
        // text: `${status && status}${(status && message) && ': '}${message && message}`,
        text: `${message && message}`,
        color: `${(type=='error') ? '#900000' : '#f2f2f25' }`,
        width: 325,
        position: 'top',
        showConfirmButton: false
    });
};

export default SwalAlert;