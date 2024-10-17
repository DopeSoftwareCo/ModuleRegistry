import { useEffect, useState } from 'react';
import { PackagesComponent } from '../Packages/Packages';
import { Packages } from '../../Models/Models';
import { getRawDBPackages } from '../../Requests/rawDB';

export const QueryDisplay = () => {
    const [packages, setPackages] = useState<Packages>([]);

    const popualtePackages = async (): Promise<void> => {
        const packagesFromRequest = await getRawDBPackages();
        setPackages(packagesFromRequest);
    };

    useEffect(() => {
        popualtePackages();
    }, []);

    return (
        <>
            <>some input interface</>
            <>
                <PackagesComponent packages={packages} />
            </>
        </>
    );
};
