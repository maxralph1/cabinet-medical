import { useContext, useEffect, useRef, useState } from 'react'; 
import AuthContext from '@/context/AuthContext.jsx'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useChats } from '@/hooks/useChats.jsx'; 
import { useChatMessages } from '@/hooks/useChatMessages.jsx'; 
import { useChatMessage } from '@/hooks/useChatMessage.jsx'; 
import SelectedUserChatComponent from '@/components/protected/nested-components/SelectedUserChatComponent';
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() {
    const { user, signOut } = useContext(AuthContext); 

    // const [toggleChats, setToggleChats] = useState(false); 
    const tabletBreakpoint = 768; 
    const [toggleChatsNav, setToggleChatsNav] = useState((window.innerWidth >= tabletBreakpoint) ? true : false); 
    
    const [toggleSettings, setToggleSettings] = useState(false); 
    const settingsRef = useRef(null); 
    const settingsIconRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                settingsRef.current && !settingsRef.current.contains(event.target) && 
                !settingsIconRef.current.contains(event.target) 
            ) {
                setToggleSettings(false); 
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); 

    const [selectedUserItem, setSelectedUserItem] = useState(null); 

    /** Message Section */
    const { chats, getChats } = useChats(); 
    console.log(chats); 

    const [currentChat, setCurrentChat] = useState(); 
    const [currentUserChattingWith, setCurrentUserChattingWith] = useState();

    // const [messages, setMessages] = useState([]);
    const { chatMessages, getChatMessages } = useChatMessages(currentChat); 
    console.log(chatMessages);
    const { chatMessage, createChatMessage } = useChatMessage(); 

    const [message, setMessage] = useState(''); 

    const handleChatMessageSubmit = async (e) => {
        e.preventDefault(); 

        const formData = new FormData();
        formData.append('type', 'regular'); 
        chatMessage?.data?.content && formData.append('content', chatMessage?.data?.content?.trim()); 
        currentChat && formData.append('chat', currentChat); 
        chatMessage?.data?.other_user && formData.append('other_user_id', chatMessage?.data?.other_user_id); 
        console.log('Message submitted:', message);
        // Clear message input after submission

        await createChatMessage(formData, currentChat);
        await chatMessage?.setData({}); 
        await getChatMessages(currentChat); 
        await getChats();
    };
    /** End of Message Section */

    /** Message Scroll Settings */
    const messageContainerRef = useRef(null);
    const [isAtBottom, setIsAtBottom] = useState(true);

    // useEffect(() => {
    //     // Scroll to the bottom when new messages are added
    //     if (messageContainerRef.current) {
    //     messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    //     }
    // }, [chatMessages]);

    useEffect(() => {
    const container = messageContainerRef.current;

    if (container) {
      // Scroll to the bottom if user is at the bottom
      const scrollToBottom = () => {
        container.scrollTop = container.scrollHeight;
      };

      // Handle scroll events to check if user has manually scrolled
      const handleScroll = () => {
        const isAtBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
        setIsAtBottom(isAtBottom); // Update if the user is at the bottom
      };

      // Initial scroll to the bottom when the component first mounts
      if (isAtBottom) {
        scrollToBottom();
      }

      // Add scroll event listener to detect manual scrolling
      container.addEventListener('scroll', handleScroll);

      // Cleanup event listener when the component unmounts
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [chatMessages, isAtBottom]); // Rerun when new messages come in or when `isAtBottom` changes

  useEffect(() => {
    // Scroll to the bottom when new messages arrive and user is at the bottom
    if (isAtBottom && messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isAtBottom]);
    /** End of Message Scroll Settings */


    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">Chats</h2>
                <div className="position-relative">
                    <span 
                        onClick={ () => setToggleSettings(!toggleSettings) }
                        ref={settingsIconRef}
                        style={{ marginTop: '-1rem' }} 
                        type="button"
                        className="py-1 pb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="23.4" height="23.4" fill="currentColor" className="bi bi-gear-fill" viewBox="0 0 16 16">
                            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
                        </svg>
                    </span>

                    { toggleSettings && (
                        <section ref={settingsRef} className="settings-pop-up position-absolute card bg-white border-radius-25 border-tertiary border-1 p-3 shadow-lg d-flex flex-column gap-0 z-3" style={{ top: '2rem', right: '0rem', width: '200px' }}>
                            <article className="mb-3 col-sm-12 col-md-6 d-flex align-items-center gap-1 px-3 mt-2">
                                {/* { (retrievedUser?.data?.receive_notifications == true) 
                                    ?   <span 
                                            type="button" 
                                            onClick={ () => {
                                                retrievedUser.setData({
                                                    ...retrievedUser?.data,
                                                    receive_notifications: false,
                                                })
                                            }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-toggle-on" viewBox="0 0 16 16">
                                                    <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8"/>
                                                </svg>
                                        </span>
                                    : (retrievedUser?.data?.receive_notifications == false) 
                                        ?   <span 
                                                type="button" 
                                                onClick={ () => {
                                                    retrievedUser.setData({
                                                        ...retrievedUser?.data,
                                                        receive_notifications: true,
                                                    })
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-toggle-off" viewBox="0 0 16 16">
                                                        <path d="M11 4a4 4 0 0 1 0 8H8a5 5 0 0 0 2-4 5 5 0 0 0-2-4zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8M0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5"/>
                                                    </svg>
                                            </span>
                                                : '' }  */}
                                                    <span type="button" >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-toggle-on" viewBox="0 0 16 16">
                                                            <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8"/>
                                                        </svg>
                                                    </span><span>Notifications</span>
                                                
                                {/* <span>Enable Notifications</span> */}
                            </article>
                            <article className="mb-3 col-sm-12 col-md-6 d-flex align-items-center gap-1 px-3 mt-2">
                                <span type="button" >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-toggle-on" viewBox="0 0 16 16">
                                        <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8"/>
                                    </svg>
                                </span><span>Notifications</span>
                            </article>
                        </section> 
                    ) }
                </div>
            </div>

            <div className="pt-3 row" style={{ height: '55vh' }}>
                { ((toggleChatsNav == false) && (window.innerWidth <= tabletBreakpoint) || (window.innerWidth >= tabletBreakpoint)) && (
                    <section className="chats col-sm-12 col-md-4">
                        <h3 className="visually-hidden">Chats</h3>
                        { (user?.user?.role != 'patient') && (
                            <div>
                                <SelectedUserChatComponent 
                                    selectedUserItem={ selectedUserItem } 
                                    setSelectedUserItem={ setSelectedUserItem } />
                            </div>
                        ) }
                        <div>
                            { (chats?.data?.length > 0) && (chats?.data
                                                                ?.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
                                                                ?.map(chat => {
                                return (
                                    <article 
                                        key={ chat?._id }
                                        type="button"
                                        onClick={ async () => {
                                            setToggleChatsNav(true); 
                                            setCurrentChat(chat?._id);
                                            setCurrentUserChattingWith(chat?.chat_users?.find(chatUser => chatUser?.user?.username != user?.user?.username )?.user); 
                                            console.log(currentUserChattingWith)
                                            await getChatMessages(chat?._id); 
                                            // await getChats();
                                            // setMessages(['hi']);
                                        } }
                                        className="d-flex align-items-center border-top border-bottom py-2">
                                            <div className="">
                                                <picture>
                                                    <source srcSet="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain" media="(orientation: portrait)" />
                                                    <img src="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain" className="object-fit-cover border-radius-25" alt="" style={{ width: '35px' }} />
                                                </picture>
                                            </div>
                                            <div className="ms-3 d-flex flex-column">
                                                <h4 className="fs-5 mb-0">
                                                    { (chat?.chat_users?.find(chatUser => chatUser?.user?.username != user?.user?.username ))?.user?.first_name + ' ' + (chat?.chat_users?.find(chatUser => chatUser?.user?.username != user?.user?.username ))?.user?.last_name }
                                                </h4>
                                                <p className='mb-0'>{ (chat?.last_message?.content)?.slice(0,25) }{ ((chat?.last_message?.content)?.length > 25) && '...' }</p>
                                            </div>
                                    </article>
                                )
                            }))}
                        </div>
                    </section>
                ) }

                {/* { (toggleChatsNav && currentUserChattingWith && (chatMessages?.data?.length > 0)) ? ( */}
                { (toggleChatsNav && currentUserChattingWith) ? (
                    <section className="messages col-sm-12 col-md-8">
                        <header 
                            className={`d-flex justify-content-between align-items-center${(window.innerWidth <= tabletBreakpoint) ? ' border border-start-0 border-end-0' : ' border'} ps-2 pe-3`}
                            style={{ borderTopRightRadius: `${(window.innerWidth >= tabletBreakpoint) ? '15px' : '0'}` }}>
                            <section className="d-flex align-items-center py-2">
                                <span 
                                    type="button"
                                    onClick={ async () => {
                                        setToggleChatsNav(false); 
                                        await getChats();
                                    } } 
                                    className="d-block d-md-none me-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                                    </svg>
                                </span>
                                <div className="me-2">
                                    <picture>
                                        <source srcSet="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain" media="(orientation: portrait)" />
                                        <img src="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain" className="object-fit-cover border-radius-25" alt="" style={{ width: '35px' }} />
                                    </picture>
                                </div>
                                <div className="d-flex flex-column">
                                    <h4 className="fs-6 mb-0">
                                        { (currentUserChattingWith?.first_name) + ' ' + (currentUserChattingWith?.last_name) }
                                    </h4>
                                    <p className='mb-0'>
                                        <small>
                                            { (currentUserChattingWith?.role == 'general_practitioner') 
                                                ? 'General Practitioner' 
                                                    : (currentUserChattingWith?.role == 'gynaecologist') 
                                                        ? 'Gynaecologist' 
                                                    : (currentUserChattingWith?.role == 'laboratory_scientist') 
                                                        ? 'Laboratory Scientist' 
                                                    : (currentUserChattingWith?.role == 'nurse') 
                                                        ? 'Nurse' 
                                                    : (currentUserChattingWith?.role == 'admin') 
                                                        ? 'Admin' 
                                                    : (currentUserChattingWith?.role == 'super-admin') 
                                                        ? 'SuperAdmin' 
                                                    : (currentUserChattingWith?.role == 'patient') 
                                                        ? 'Patient' 
                                                    : ''
                                            }
                                        </small>
                                    </p>
                                </div>
                            </section>
                            <section>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-camera-video-fill text-secondary" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2z"/>
                                    </svg>
                                </span>
                                <span className="ms-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-telephone-fill text-secondary" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
                                    </svg>
                                </span>
                                <span className="ms-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots text-secondary" viewBox="0 0 16 16">
                                        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                                    </svg>
                                </span>
                            </section>
                        </header>
                        
                        <section 
                            className={`w-100${(window.innerWidth <= tabletBreakpoint) ? ' border border-start-0 border-end-0' : ' border'} px-2 py-4 h-100 position-relative d-flex flex-column gap-3`}
                            style={{ borderBottomRightRadius: `${(window.innerWidth >= tabletBreakpoint) ? '15px' : '0'}`, 
                                    maxHeight: `${(window.innerWidth >= tabletBreakpoint) ? '50vh' : '65vh'}` }}>
                                        
                            { (chatMessages?.data?.length > 0) && (
                                <section className="h-100 pb-5">
                                    <div className={`h-100 w-100 overflow-y-auto d-flex flex-column justify-content-end align-items-end row-gap-2 px-2`} ref={messageContainerRef}>
                                        { (chatMessages?.data?.map(chatMessage => {
                                            return (
                                                <article key={ chatMessage?._id } className={`d-flex flex-column ${(user?.user?.user_id == chatMessage?.user) ? 'justify-content-end align-items-end' : 'justify-content-start align-items-start'} py-1 px-2 border border-tertiary border-radius-15 w-100 w-md-50`}>
                                                    <p className="mb-0">{ chatMessage?.content }</p>
                                                    <span style={{ fontSize: 'x-small' }}>{ dayjs(chatMessage?.created_at)?.format("HH:mm") }</span>
                                                </article>
                                            )
                                        }))}
                                    </div>
                                </section>
                            ) }

                            <div className="chat-input-container w-100 pb-2 ps-0 pe-3 position-absolute bottom-0">
                                {/* ContentEditable div for text input */}
                                {/* <form> */}
                                    <div
                                        contentEditable
                                        className="chat-input px-3 pt-2"
                                        onKeyDown={(e) => { 
                                            if (e.key === 'Enter') {
                                                e.preventDefault();  
                                                handleChatMessageSubmit(e); 

                                                // if (messageContainerRef.current) {
                                                //     messageContainerRef.current.innerHTML = ''; 
                                                // }
                                                e.target.innerHTML = '';
                                            }
                                        }}
                                        onInput={e => chatMessage.setData({
                                            ...chatMessage?.data,
                                            content: e.target.innerHTML,  // Get the content of the editable div
                                            // other_user_id: currentUserChattingWith?._id // You can add additional data here
                                        })}
                                        placeholder="Type a message"
                                        style={{
                                            border: '1px solid #ccc',
                                            borderRadius: '10px',
                                            minHeight: '40px',
                                            width: '100%',
                                            overflowY: 'auto',
                                            whiteSpace: 'pre-wrap',
                                            wordWrap: 'break-word',
                                            direction: 'ltr',
                                            outline: 'none',
                                        }}
                                    />
                                {/* </form> */}
                            </div>
                        </section>
                    </section>
                ) : (
                    <section className="messages col-md-8 h-100 d-flex align-item-center justify-content-center m-auto py-5">
                        {/* <p className="d-flex h-100 py-5">Keep in touch with your contacts and never miss an appointment.</p> */}
                    </section>
                ) }
            </div>
        </Layout>
    )
}
