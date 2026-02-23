import { PAGINATION } from "@/config/constants";
import { useEffect, useState } from "react";


interface UseEntitySearchProps<T extends{
    search:string,
    page:number
}> {
    params:T;
    setParams:(params:T)=>void;
    deboundeMs?:number;
}

export function useEntitySearch<T extends{
    search:string;
    page:number;
}>({
    params,
    setParams,
    deboundeMs=500
}:UseEntitySearchProps<T>){
    const [localSearch, setLocalSearch]= useState(params.search);

    useEffect(()=>{
        if(localSearch===""&& params.search!==""){
            setParams({
                ...params,
                search:"",
                page:PAGINATION.DEFAULT_PAGE
            });
            return;
        }

        const timer = setTimeout(()=>{
            if(localSearch!==params.search){
                setParams({
                    ...params,
                    search: localSearch,
                    page:PAGINATION.DEFAULT_PAGE,
                });
            }
        },deboundeMs);

        return ()=> clearTimeout(timer);
    },[localSearch,params,setParams,deboundeMs]);
    
    useEffect(()=>{
        setLocalSearch(params.search)
    },[params.search]);

    return{
        searchValue: localSearch,
        onSearchChange:setLocalSearch
    } 
}