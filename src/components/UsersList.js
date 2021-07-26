import { useState } from "react";

const UsersList = () => {

    const [users, setUsers] = useState([
        {name: "John", email: "GG@gmail.com"}
    ])

    return ( 

        <div>
            <h1>List of users</h1>
            {
                users.map(user => (
                    <div>
                        <p>{user.name}</p>
                        <p>{user.email}</p>
                    </div>
                ))
            }
        </div>
    );
}
 
export default UsersList;