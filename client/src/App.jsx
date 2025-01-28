import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'; 
import { route } from '@/routes'; 
import { AuthProvider } from '@/context/AuthContext.jsx'; 
import AuthRoute from '@/utils/AuthRoute.jsx'; 
import ProtectedRoute from '@/utils/ProtectedRoute.jsx'; 
import TrackPage from '@/utils/TrackPage.jsx'; 

import SignUp from '@/views/auth/SignUp.jsx'; 
import SignUpAsStaff from '@/views/auth/SignUpAsStaff.jsx'; 
import VerifyEmail from '@/views/auth/VerifyEmail.jsx';
import SignIn from '@/views/auth/SignIn.jsx'; 
import PasswordlessSignInRequest from '@/views/auth/PasswordlessSignInRequest.jsx';
import PasswordlessSignIn from '@/views/auth/PasswordlessSignIn.jsx'; 
import PasswordResetRequest from '@/views/auth/PasswordResetRequest.jsx';
import PasswordReset from '@/views/auth/PasswordReset.jsx'; 

import BlogCategories from '@/views/public/blog/Categories.jsx'; 
import BlogCategory from '@/views/public/blog/Category.jsx'; 
import BlogPublications from '@/views/public/blog/Publications.jsx'; 
import BlogPublication from '@/views/public/blog/Publication.jsx'; 
import Paid from '@/views/public/Paid.jsx'; 
import Pay from '@/views/public/Pay.jsx'; 
import About from '@/views/public/About.jsx'; 
import Contact from '@/views/public/Contact.jsx'; 
import Services from '@/views/public/Services.jsx'; 
import Index from '@/views/public/Index.jsx'; 

import ProtectedAppointmentShow from '@/views/protected/appointments/Show.jsx'; 
import ProtectedAppointmentEdit from '@/views/protected/appointments/Edit.jsx'; 
import ProtectedAppointmentCreate from '@/views/protected/appointments/Create.jsx'; 
import ProtectedAppointmentsIndex from '@/views/protected/appointments/Index.jsx'; 

import ProtectedBlogIndex from '@/views/protected/blog/Index.jsx'; 

import ProtectedBlogCategoryShow from '@/views/protected/blog/categories/Show.jsx'; 
import ProtectedBlogCategoryEdit from '@/views/protected/blog/categories/Edit.jsx'; 
import ProtectedBlogCategoryCreate from '@/views/protected/blog/categories/Create.jsx'; 
import ProtectedBlogCategoriesIndex from '@/views/protected/blog/categories/Index.jsx'; 

import ProtectedBlogPublicationShow from '@/views/protected/blog/publications/Show.jsx'; 
import ProtectedBlogPublicationEdit from '@/views/protected/blog/publications/Edit.jsx'; 
import ProtectedBlogPublicationCreate from '@/views/protected/blog/publications/Create.jsx'; 
import ProtectedBlogPublicationsIndex from '@/views/protected/blog/publications/Index.jsx'; 

import ProtectedChatShow from '@/views/protected/chats/Show.jsx'; 
import ProtectedChatEdit from '@/views/protected/chats/Edit.jsx'; 
import ProtectedChatCreate from '@/views/protected/chats/Create.jsx'; 
import ProtectedChatsIndex from '@/views/protected/chats/Index.jsx'; 

import ProtectedDiagnosisShow from '@/views/protected/diagnoses/Show.jsx'; 
import ProtectedDiagnosisEdit from '@/views/protected/diagnoses/Edit.jsx'; 
import ProtectedDiagnosisCreate from '@/views/protected/diagnoses/Create.jsx'; 
import ProtectedDiagnosesIndex from '@/views/protected/diagnoses/Index.jsx'; 

import ProtectedDiagnosisTypeShow from '@/views/protected/diagnosis-types/Show.jsx'; 
import ProtectedDiagnosisTypeEdit from '@/views/protected/diagnosis-types/Edit.jsx'; 
import ProtectedDiagnosisTypeCreate from '@/views/protected/diagnosis-types/Create.jsx'; 
import ProtectedDiagnosisTypesIndex from '@/views/protected/diagnosis-types/Index.jsx'; 

import ProtectedInventoryShow from '@/views/protected/inventory/Show.jsx'; 
import ProtectedInventoryEdit from '@/views/protected/inventory/Edit.jsx'; 
import ProtectedInventoryCreate from '@/views/protected/inventory/Create.jsx'; 
import ProtectedInventoryIndex from '@/views/protected/inventory/Index.jsx'; 

import ProtectedMedicalBillShow from '@/views/protected/medical-bills/Show.jsx'; 
import ProtectedMedicalBillEdit from '@/views/protected/medical-bills/Edit.jsx'; 
import ProtectedMedicalBillCreate from '@/views/protected/medical-bills/Create.jsx'; 
import ProtectedMedicalBillsIndex from '@/views/protected/medical-bills/Index.jsx'; 

import ProtectedNotificationsIndex from '@/views/protected/notifications/Index.jsx'; 

import ProtectedPatientChartShow from '@/views/protected/patient-charts/Show.jsx'; 
import ProtectedPatientChartEdit from '@/views/protected/patient-charts/Edit.jsx'; 
import ProtectedPatientChartCreate from '@/views/protected/patient-charts/Create.jsx'; 
import ProtectedPatientChartsIndex from '@/views/protected/patient-charts/Index.jsx'; 

import ProtectedPatientShow from '@/views/protected/patients/Show.jsx'; 
import ProtectedPatientEdit from '@/views/protected/patients/Edit.jsx'; 
import ProtectedPatientCreate from '@/views/protected/patients/Create.jsx'; 
import ProtectedPatientsIndex from '@/views/protected/patients/Index.jsx'; 

import ProtectedProfessionalShow from '@/views/protected/professionals/Show.jsx'; 
import ProtectedProfessionalEdit from '@/views/protected/professionals/Edit.jsx'; 
import ProtectedProfessionalCreate from '@/views/protected/professionals/Create.jsx'; 
import ProtectedProfessionalsIndex from '@/views/protected/professionals/Index.jsx'; 

import ProtectedProfileIndex from '@/views/protected/profile/Index.jsx'; 

import ProtectedRegimenAdministrationShow from '@/views/protected/regimen-administrations/Show.jsx'; 
import ProtectedRegimenAdministrationEdit from '@/views/protected/regimen-administrations/Edit.jsx'; 
import ProtectedRegimenAdministrationCreate from '@/views/protected/regimen-administrations/Create.jsx'; 
import ProtectedRegimenAdministrationsIndex from '@/views/protected/regimen-administrations/Index.jsx'; 

import ProtectedRegimenShow from '@/views/protected/regimens/Show.jsx'; 
import ProtectedRegimenEdit from '@/views/protected/regimens/Edit.jsx'; 
import ProtectedRegimenCreate from '@/views/protected/regimens/Create.jsx'; 
import ProtectedRegimensIndex from '@/views/protected/regimens/Index.jsx'; 

import ProtectedSettingsIndex from '@/views/protected/settings/Index.jsx'; 

import ProtectedUserAppointments from '@/views/protected/users/show/Appointments.jsx'; 
import ProtectedUserBlogPublications from '@/views/protected/users/show/BlogPublications.jsx'; 
import ProtectedUserDiagnoses from '@/views/protected/users/show/Diagnoses.jsx'; 
import ProtectedUserMedicalBills from '@/views/protected/users/show/MedicalBills.jsx'; 
import ProtectedUserRegimens from '@/views/protected/users/show/Regimens.jsx'; 

import ProtectedUserShow from '@/views/protected/users/Show.jsx'; 
import ProtectedUserEdit from '@/views/protected/users/Edit.jsx'; 
import ProtectedUserCreate from '@/views/protected/users/Create.jsx'; 
import ProtectedUsersIndex from '@/views/protected/users/Index.jsx'; 

import ProtectedIndex from '@/views/protected/Index.jsx'; 

import NotFound from '@/views/NotFound.jsx'; 


function App() {
  return (
    <BrowserRouter> 
      <AuthProvider>
        <TrackPage />
        <Routes>
            {/* Auth Routes */} 
            <Route element={ <AuthRoute />}>
              <Route path={ route('sign-up') } element={ <SignUp /> } /> 
              <Route path={ route('sign-up-as-staff') } element={ <SignUpAsStaff /> } /> 
              <Route path={ route('verify-email') } element={ <VerifyEmail /> } /> 
              <Route path={ route('sign-in') } element={ <SignIn /> } /> 
              <Route path={ route('passwordless-signin-request') } element={ <PasswordlessSignInRequest /> } /> 
              <Route path={ route('passwordless-signin') } element={ <PasswordlessSignIn /> } /> 
              <Route path={ route('password-reset-request') } element={ <PasswordResetRequest /> } /> 
              <Route path={ route('password-reset') } element={ <PasswordReset /> } /> 
            </Route>

            {/* Public Routes */} 
            <Route path={ route('blog.categories.show') } element={ <BlogCategory /> } /> 
            <Route path={ route('blog.categories.index') } element={ <BlogCategories /> } /> 
            <Route path={ route('blog.publications.show') } element={ <BlogPublication /> } /> 
            <Route path={ route('blog.publications.index') } element={ <BlogPublications /> } /> 
            <Route path={ route('paid') } element={ <Paid /> } /> 
            <Route path={ route('pay') } element={ <Pay /> } /> 
            <Route path={ route('about') } element={ <About /> } /> 
            <Route path={ route('contact') } element={ <Contact /> } /> 
            <Route path={ route('services') } element={ <Services /> } /> 

            <Route path={ route('index') } element={ <Index /> } /> 

            {/* Proctected Routes */} 
            <Route element={ <ProtectedRoute />}>
              <Route path={ route('home.appointments.show') } element={ <ProtectedAppointmentShow /> } /> 
              <Route path={ route('home.appointments.edit') } element={ <ProtectedAppointmentEdit /> } /> 
              <Route path={ route('home.appointments.create') } element={ <ProtectedAppointmentCreate /> } /> 
              <Route path={ route('home.appointments.index') } element={ <ProtectedAppointmentsIndex /> } /> 

              <Route path={ route('home.blog.index') } element={ <ProtectedBlogIndex /> } /> 
              <Route path={ route('home.blog.categories.show') } element={ <ProtectedBlogCategoryShow /> } /> 
              <Route path={ route('home.blog.categories.edit') } element={ <ProtectedBlogCategoryEdit /> } /> 
              <Route path={ route('home.blog.categories.create') } element={ <ProtectedBlogCategoryCreate /> } /> 
              <Route path={ route('home.blog.categories.index') } element={ <ProtectedBlogCategoriesIndex /> } /> 

              <Route path={ route('home.blog.publications.show') } element={ <ProtectedBlogPublicationShow /> } /> 
              <Route path={ route('home.blog.publications.edit') } element={ <ProtectedBlogPublicationEdit /> } /> 
              <Route path={ route('home.blog.publications.create') } element={ <ProtectedBlogPublicationCreate /> } /> 
              <Route path={ route('home.blog.publications.index') } element={ <ProtectedBlogPublicationsIndex /> } /> 

              <Route path={ route('home.chats.show') } element={ <ProtectedChatShow /> } />
              <Route path={ route('home.chats.edit') } element={ <ProtectedChatEdit /> } />
              <Route path={ route('home.chats.create') } element={ <ProtectedChatCreate /> } />
              <Route path={ route('home.chats.index') } element={ <ProtectedChatsIndex /> } /> 

              <Route path={ route('home.diagnoses.show') } element={ <ProtectedDiagnosisShow /> } />
              <Route path={ route('home.diagnoses.edit') } element={ <ProtectedDiagnosisEdit /> } />
              <Route path={ route('home.diagnoses.create') } element={ <ProtectedDiagnosisCreate /> } />
              <Route path={ route('home.diagnoses.index') } element={ <ProtectedDiagnosesIndex /> } /> 

              <Route path={ route('home.diagnosis-types.show') } element={ <ProtectedDiagnosisTypeShow /> } />
              <Route path={ route('home.diagnosis-types.edit') } element={ <ProtectedDiagnosisTypeEdit /> } />
              <Route path={ route('home.diagnosis-types.create') } element={ <ProtectedDiagnosisTypeCreate /> } />
              <Route path={ route('home.diagnosis-types.index') } element={ <ProtectedDiagnosisTypesIndex /> } /> 

              <Route path={ route('home.inventory.show') } element={ <ProtectedInventoryShow /> } />
              <Route path={ route('home.inventory.edit') } element={ <ProtectedInventoryEdit /> } />
              <Route path={ route('home.inventory.create') } element={ <ProtectedInventoryCreate /> } />
              <Route path={ route('home.inventory.index') } element={ <ProtectedInventoryIndex /> } /> 

              <Route path={ route('home.medical-bills.show') } element={ <ProtectedMedicalBillShow /> } />
              <Route path={ route('home.medical-bills.edit') } element={ <ProtectedMedicalBillEdit /> } />
              <Route path={ route('home.medical-bills.create') } element={ <ProtectedMedicalBillCreate /> } />
              <Route path={ route('home.medical-bills.index') } element={ <ProtectedMedicalBillsIndex /> } /> 

              <Route path={ route('home.notifications.index') } element={ <ProtectedNotificationsIndex /> } /> 

              <Route path={ route('home.patient-charts.show') } element={ <ProtectedPatientChartShow /> } />
              <Route path={ route('home.patient-charts.edit') } element={ <ProtectedPatientChartEdit /> } />
              <Route path={ route('home.patient-charts.create') } element={ <ProtectedPatientChartCreate /> } />
              <Route path={ route('home.patient-charts.index') } element={ <ProtectedPatientChartsIndex /> } /> 

              <Route path={ route('home.patients.show') } element={ <ProtectedPatientShow /> } />
              <Route path={ route('home.patients.edit') } element={ <ProtectedPatientEdit /> } />
              <Route path={ route('home.patients.create') } element={ <ProtectedPatientCreate /> } />
              <Route path={ route('home.patients.index') } element={ <ProtectedPatientsIndex /> } /> 

              <Route path={ route('home.professionals.show') } element={ <ProtectedProfessionalShow /> } />
              <Route path={ route('home.professionals.edit') } element={ <ProtectedProfessionalEdit /> } />
              <Route path={ route('home.professionals.create') } element={ <ProtectedProfessionalCreate /> } />
              <Route path={ route('home.professionals.index') } element={ <ProtectedProfessionalsIndex /> } /> 

              <Route path={ route('home.profile.index') } element={ <ProtectedProfileIndex /> } /> 

              <Route path={ route('home.regimen-administrations.show') } element={ <ProtectedRegimenAdministrationShow /> } />
              <Route path={ route('home.regimen-administrations.edit') } element={ <ProtectedRegimenAdministrationEdit /> } />
              <Route path={ route('home.regimen-administrations.create') } element={ <ProtectedRegimenAdministrationCreate /> } />
              <Route path={ route('home.regimen-administrations.index') } element={ <ProtectedRegimenAdministrationsIndex /> } /> 

              <Route path={ route('home.regimens.show') } element={ <ProtectedRegimenShow /> } />
              <Route path={ route('home.regimens.edit') } element={ <ProtectedRegimenEdit /> } />
              <Route path={ route('home.regimens.create') } element={ <ProtectedRegimenCreate /> } />
              <Route path={ route('home.regimens.index') } element={ <ProtectedRegimensIndex /> } /> 

              <Route path={ route('home.settings.index') } element={ <ProtectedSettingsIndex /> } /> 

              <Route path={ route('home.users.show.appointments') } element={ <ProtectedUserAppointments /> } /> 
              <Route path={ route('home.users.show.blog-publications') } element={ <ProtectedUserBlogPublications /> } /> 
              <Route path={ route('home.users.show.diagnoses') } element={ <ProtectedUserDiagnoses /> } /> 
              <Route path={ route('home.users.show.medical-bills') } element={ <ProtectedUserMedicalBills /> } /> 
              <Route path={ route('home.users.show.regimens') } element={ <ProtectedUserRegimens /> } /> 

              <Route path={ route('home.users.show') } element={ <ProtectedUserShow /> } />
              <Route path={ route('home.users.edit') } element={ <ProtectedUserEdit /> } />
              <Route path={ route('home.users.create') } element={ <ProtectedUserCreate /> } />
              <Route path={ route('home.users.index') } element={ <ProtectedUsersIndex /> } /> 

              <Route path={ route('home.index') } element={ <ProtectedIndex /> } />
            </Route> 

            {/* 404 */} 
            <Route path='*' element={ <NotFound /> } />
        </Routes> 
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
