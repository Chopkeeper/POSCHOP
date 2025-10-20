import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Settings } from '../types';

const SettingsPage: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [settings, setSettings] = useState<Settings>(state.settings);
    const [isSaved, setIsSaved] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch({ type: 'UPDATE_SETTINGS', payload: {
            ...settings,
            taxRate: Number(settings.taxRate),
            commissionRate: Number(settings.commissionRate)
        }});
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">ตั้งค่าร้านค้า</h1>
            <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">ชื่อร้าน</label>
                        <input
                            type="text"
                            name="storeName"
                            id="storeName"
                            value={settings.storeName}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">ที่อยู่</label>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            value={settings.address}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">อัตราภาษี (%)</label>
                            <input
                                type="number"
                                name="taxRate"
                                id="taxRate"
                                value={settings.taxRate}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="commissionRate" className="block text-sm font-medium text-gray-700">อัตราค่าคอมมิชชั่น (%)</label>
                            <input
                                type="number"
                                name="commissionRate"
                                id="commissionRate"
                                value={settings.commissionRate}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-end">
                        {isSaved && <p className="text-green-600 mr-4">บันทึกเรียบร้อย!</p>}
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700">
                            บันทึกการเปลี่ยนแปลง
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsPage;
