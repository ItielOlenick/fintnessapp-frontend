import { useEffect, useState } from "react";
import UsersService from "../services/UsersService";


const UsersList = () => {

    const [users, setUsers] = useState([]);

useEffect(() => { 
    UsersService.getAll()
    .then(response => {
        console.log('printing response', response.data);
        setUsers(response.data);
    })
    .catch(error => {
        console.log("Error - somthing is wrond", error);
    })
}, []);

    return ( 

        <div>
            <h1>List of users</h1>
            {
                users && users.map(user => (
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