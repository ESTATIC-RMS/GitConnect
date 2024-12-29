import { React, useState, useCallback, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import ProfileInfo from '../components/ProfileInfo'
import Repos from '../components/Repos'
import Search from '../components/Search'
import SortRepos from '../components/SortRepos'
import Spinner from '../components/Spinner'

export default function HomePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [repos, setRepos] = useState([]);
    const [sortType, setSortType] = useState('recent');

    const fetchUserProfile = useCallback(async (userName = 'ESTATIC-RMS') => {
        try {
            const response = await fetch(`/api/users/profile/${userName}`);
            const { userInfo, userRepos } = await response.json();
            setUserProfile(userInfo);
            setRepos(userRepos);
            return { reposData: userRepos, userData: userInfo }; // Return repository and user data
        } catch (error) {
            toast.error(error.message); // Display error message
        }
    }, []);

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile])


    const onSearch = async (e, userName) => {
        e.preventDefault();
        setIsLoading(true);
        const { reposData, userData } = await fetchUserProfile(userName);
        setUserProfile(userData);
        setRepos(reposData);
        setIsLoading(false);
    }

    const onSort = (sortType) => {
        if (sortType === "recent") {
            repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); //descending, recent first
        } else if (sortType === "stars") {
            repos.sort((a, b) => b.stargazers_count - a.stargazers_count); //descending, most stars first
        } else if (sortType === "forks") {
            repos.sort((a, b) => b.forks_count - a.forks_count); //descending, most forks first
        }
        setSortType(sortType);
        setRepos([...repos]);
    };

    return (
        <div className='m-4'>
            <Search onSearch={onSearch} />
            {repos.length > 0 && <SortRepos onSort={onSort} sortType={sortType} />}
            <div className='flex gap-4 flex-col lg:flex-row justify-center items-start'>
                {!isLoading && <ProfileInfo userProfile={userProfile} />}
                {!isLoading && <Repos repos={repos} />}
                {isLoading && <Spinner />}
            </div>
        </div>
    )
}
