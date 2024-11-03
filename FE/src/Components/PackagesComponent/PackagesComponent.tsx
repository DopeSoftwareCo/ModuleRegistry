import { useEffect, useState } from 'react';
import { PackageComponent, PackageComponentProps } from '../PackageComponent/PackageComponent';
import { PackagesContainer } from './PackagesComponentStyle';
import { StatusDisplay } from '../StatusDisplay/StatusDisplay';
import { getAllPackagesRequest } from './Requests';

export const PackagesComponent = () => {
    //make a request to get all packages
    const [packages, setPackages] = useState<PackageComponentProps[] | undefined>([]);
    const [reqErr, setReqErr] = useState<string | undefined>(undefined);
    const [success, setSuccessMessage] = useState<string | undefined>(undefined);

    const makeRequest = async () => {
        const psFromDB = await getAllPackagesRequest((error) => setReqErr(error));
        if (psFromDB) {
            setPackages(psFromDB);
        }
    };

    useEffect(() => {
        makeRequest();
    }, []);

    return (
        <PackagesContainer>
            {packages?.map((p, idx) => (
                <PackageComponent key={idx} {...p} />
            ))}
            <StatusDisplay
                err={reqErr}
                setErr={setReqErr}
                successMessage={success}
                setSuccess={setSuccessMessage}
            />
        </PackagesContainer>
    );
};
