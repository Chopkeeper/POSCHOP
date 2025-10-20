import * as React from 'react';
import { useAppContext } from '../context/AppContext';
import { User, UserRole } from '../types';

const UserModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: Omit<User, 'id'>) => void;
}> = ({ isOpen, onClose, onSave }) => {
    const initialFormState = {
        name: '',
        username: '',
        password: '',
        role: UserRole.Cashier,
    };
    const [formData, setFormData] = React.useState<Omit<User, 'id'>>(initialFormState);

    React.useEffect(() => {
        if(isOpen) {
            setFormData(initialFormState);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if(!formData.name || !formData.username || !formData.password) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">เพิ่มพนักงานใหม่</h2>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">ชื่อ-นามสกุล</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded mt-1" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">ชื่อผู้ใช้ (Username)</label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full p-2 border rounded mt-1" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">รหัสผ่าน (Password)</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded mt-1" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">ตำแหน่ง</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded mt-1">
                            {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                        </select>
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">ยกเลิก</button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">บันทึก</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const UsersPage: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [isModalOpen, setModalOpen] = React.useState(false);

    const handleAddUser = (user: Omit<User, 'id'>) => {
        dispatch({ type: 'ADD_USER', payload: user });
        setModalOpen(false);
    };
    
    const handleDeleteUser = (userId: string) => {
        if(window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบพนักงานคนนี้?')) {
            dispatch({ type: 'DELETE_USER', payload: userId });
        }
    };

    return (
        <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">จัดการพนักงาน</h1>
                <button onClick={() => setModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">
                    + เพิ่มพนักงานใหม่
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3 text-left">ชื่อ-นามสกุล</th>
                            <th className="p-3 text-left">Username</th>
                            <th className="p-3 text-left">ตำแหน่ง</th>
                            <th className="p-3 text-center">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.users.map(user => (
                            <tr key={user.id} className="border-b">
                                <td className="p-3 font-medium">{user.name}</td>
                                <td className="p-3 text-gray-600">{user.username}</td>
                                <td className="p-3 text-gray-600">{user.role}</td>
                                <td className="p-3 text-center">
                                    <button 
                                        onClick={() => handleDeleteUser(user.id)} 
                                        className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                                        disabled={user.role === UserRole.Admin} // Prevent deleting the main admin
                                    >
                                        ลบ
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <UserModal 
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleAddUser}
            />
        </div>
    );
};

export default UsersPage;