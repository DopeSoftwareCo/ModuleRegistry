import { Packages } from '../Models/Models';

//Note the Packages type
//this is separate from the API types
//this type is what we will use when displaying a package from any request from the api
//with this we will be able to have one display method for every query.

export const getRatingByID = async (_id: string): Promise<Packages> => {
    const response = await fetch(``);
    return [];
};

export const getPackageDataByID = async (_id: string): Promise<Packages> => {
    return [];
};

export const getAllPackages = async (): Promise<Packages> => {
    return [];
};
