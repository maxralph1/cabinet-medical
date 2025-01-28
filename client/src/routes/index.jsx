const routeNames = {

    /** Auth Routes */ 
    'sign-up': '/sign-up', 
    'sign-up-as-staff': '/sign-up-as-staff', 
    'verify-email': '/verify-email/:username/:token', 
    'sign-in': '/sign-in', 
    'passwordless-signin': '/passwordless-signin/:username/:token', 
    'passwordless-signin-request': '/passwordless-signin-request', 
    'password-reset': '/password-reset/:username/:token', 
    'password-reset-request': '/password-reset-request', 


    /** Private Routes */ 
    'home.appointments.show': '/home/appointments/:id/show', 
    'home.appointments.edit': '/home/appointments/:id/edit', 
    'home.appointments.create': '/home/appointments/create', 
    'home.appointments.index': '/home/appointments', 

    'home.blog.index': '/home/blog', 
    'home.blog.categories.show': '/home/blog/categories/:id/show', 
    'home.blog.categories.edit': '/home/blog/categories/:id/edit', 
    'home.blog.categories.create': '/home/blog/categories/create', 
    'home.blog.categories.index': '/home/blog/categories', 

    'home.blog.publications.show': '/home/blog/publications/:id/show', 
    'home.blog.publications.edit': '/home/blog/publications/:id/edit', 
    'home.blog.publications.create': '/home/blog/publications/create', 
    'home.blog.publications.index': '/home/blog/publications', 

    'home.chats.show': '/home/chats/:id/show', 
    'home.chats.edit': '/home/chats/:id/edit', 
    'home.chats.create': '/home/chats/create', 
    'home.chats.index': '/home/chats', 

    'home.diagnosis-types.show': '/home/diagnosis-types/:id/show', 
    'home.diagnosis-types.edit': '/home/diagnosis-types/:id/edit', 
    'home.diagnosis-types.create': '/home/diagnosis-types/create', 
    'home.diagnosis-types.index': '/home/diagnosis-types', 

    'home.diagnoses.show': '/home/diagnoses/:id/show', 
    'home.diagnoses.edit': '/home/diagnoses/:id/edit', 
    'home.diagnoses.create': '/home/diagnoses/create', 
    'home.diagnoses.index': '/home/diagnoses', 

    'home.inventory.show': '/home/inventory/:id/show', 
    'home.inventory.edit': '/home/inventory/:id/edit', 
    'home.inventory.create': '/home/inventory/create', 
    'home.inventory.index': '/home/inventory', 

    'home.medical-bills.show': '/home/medical-bills/:id/show', 
    'home.medical-bills.edit': '/home/medical-bills/:id/edit', 
    'home.medical-bills.create': '/home/medical-bills/create', 
    'home.medical-bills.index': '/home/medical-bills', 

    'home.patient-charts.show': '/home/patient-charts/:id/show', 
    'home.patient-charts.edit': '/home/patient-charts/:id/edit', 
    'home.patient-charts.create': '/home/patient-charts/create', 
    'home.patient-charts.index': '/home/patient-charts', 

    'home.patients.show': '/home/patients/:id/show', 
    'home.patients.edit': '/home/patients/:id/edit', 
    'home.patients.create': '/home/patients/create', 
    'home.patients.index': '/home/patients', 

    'home.professionals.show': '/home/professionals/:id/show', 
    'home.professionals.edit': '/home/professionals/:id/edit', 
    'home.professionals.create': '/home/professionals/create', 
    'home.professionals.index': '/home/professionals', 

    'home.regimen-administrations.show': '/home/regimen-administrations/:id/show', 
    'home.regimen-administrations.edit': '/home/regimen-administrations/:id/edit', 
    'home.regimen-administrations.create': '/home/regimen-administrations/create', 
    'home.regimen-administrations.index': '/home/regimen-administrations', 

    'home.regimens.show': '/home/regimens/:id/show', 
    'home.regimens.edit': '/home/regimens/:id/edit', 
    'home.regimens.create': '/home/regimens/create', 
    'home.regimens.index': '/home/regimens', 

    'home.profile.index': '/home/profile', 

    'home.settings.index': '/home/settings', 

    'home.users.show.appointments': '/home/users/:username/appointments', 
    'home.users.show.blog-posts': '/home/users/:username/blog-posts', 
    'home.users.show.diagnoses': '/home/users/:username/diagnoses', 
    'home.users.show.medical-bills': '/home/users/:username/medical-bills', 
    'home.users.show.regimens': '/home/users/:username/regimens', 

    'home.users.show': '/home/users/:username/show', 
    'home.users.edit': '/home/users/:username/edit', 
    'home.users.index': '/home/user-management', 

    'home.index': '/home', 


    /** Public Routes */ 
    'blog.categories.show': '/blog/categories/:id/show', 
    'blog.categories.index': '/blog/categories', 

    'blog.publications.show': '/blog/publications/:id/show', 
    'blog.publications.index': '/blog/publications', 

    'paid': '/paid', 
    'pay': '/pay', 

    'about': '/about', 
    'contact': '/contact', 
    'services': '/services', 

    'index': '/'
} 

function route(name, params = {}) {
    let url = routeNames[name] 

    for (let prop in params) {
        if (Object?.prototype?.hasOwnProperty?.call(params, prop)) {
            url = url?.replace(`:${prop}`, params[prop])
        }
    } 

    return url;
} 


export { route }