import React, {useEffect, useState } from 'react';
import {Avatar, useChatContext } from 'stream-chat-react'

import {InviteIcon } from '../assets';

const ListContainer = ({ children, query, setQuery }) => {
    return (
        <div className='user-list__container'>
            <div className='user-list__header'>
                <p>User</p>
                <p>Invite</p>
            </div>
            <input
                aria-label='Search members'
                className='user-list__search'
                onChange={(event) => setQuery(event.target.value)}
                placeholder='Search members'
                type='search'
                value={query}
            />
            {children}
        </div>
    )
}

const UserItem = ({ user, selected, setSelectedUsers }) => {
    const handleSelect = () => {
        if(selected){
            setSelectedUsers((prevUsers) => prevUsers.filter((prevUser) => prevUser !== user.id))
        }else{
            setSelectedUsers((prevUsers) => [...prevUsers, user.id])
        }
    }
    return(
        <div className='user-item__wrapper' onClick={handleSelect}>
            <div className='user-item__name-wrapper'>
                <Avatar image={user.image} name={user.fullName || user.id} size={32}/>
                <p className="user-item__name">{user.fullName || user.id}</p>
            </div>
            {selected ? <InviteIcon /> :  <div className="user-item__invite-empty" /> }
        </div>
    )
}
const UserList = ({ setSelectedUsers }) => {
    const { client } = useChatContext();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedUserIds, setSelectedUserIds] = useState([]);

    useEffect(() => {
        let isCurrentRequest = true;
        const searchQuery = query.trim();

        const getUsers = async () => {
            setLoading(true);
            setError(false);

            try {
                const filters = {
                    id: { $ne: client.userID },
                    ...(searchQuery && { name: { $autocomplete: searchQuery } }),
                };
                const response = await client.queryUsers(
                    filters,
                    { id: 1 },
                    { limit: searchQuery ? 25 : 8 }
                );

                if (isCurrentRequest) setUsers(response.users);
            } catch (requestError) {
                if (isCurrentRequest) setError(true);
            } finally {
                if (isCurrentRequest) setLoading(false);
            }
        };

        const timeout = setTimeout(getUsers, searchQuery ? 250 : 0);

        return () => {
            isCurrentRequest = false;
            clearTimeout(timeout);
        };
    }, [client, query]);

  return (
    <ListContainer query={query} setQuery={setQuery}>
        {error ? (
            <div className='user-list__message'>
                Error Loading, please refresh and try again.
            </div>
        ) : loading ? (
            <div className="user-list__message">
                Searching members...
            </div>
        ) : users.length === 0 ? (
            <div className='user-list__message'>
                No members found.
            </div>
        ) : (
            users.map((user) => (
                <UserItem
                    key={user.id}
                    user={user}
                    selected={selectedUserIds.includes(user.id)}
                    setSelectedUsers={(updateUsers) => {
                        setSelectedUserIds(updateUsers);
                        setSelectedUsers(updateUsers);
                    }}
                />
            ))
        )}
    </ListContainer>
  )
}

export default UserList