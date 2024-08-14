/* eslint-disable no-unused-vars */
import React from 'react';

const Settings = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-3xl font-bold mb-6">Settings</h1>
                <p className="text-gray-700 mb-6">
                    Customize your settings below. Here you can adjust preferences and manage your account.
                </p>
                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                        <form>
                            <div className="mb-4">
                                <label className="block text-gray-600 mb-2" htmlFor="email">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-600 mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    placeholder="Enter your new password"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition duration-300"
                            >
                                Save Changes
                            </button>
                        </form>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                        <form>
                            <div className="mb-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox text-blue-600"
                                    />
                                    <span className="ml-2 text-gray-600">Receive email notifications</span>
                                </label>
                            </div>
                            <div className="mb-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox text-blue-600"
                                    />
                                    <span className="ml-2 text-gray-600">Receive SMS notifications</span>
                                </label>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
