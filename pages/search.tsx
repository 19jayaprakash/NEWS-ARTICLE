import NewsArticlesGrid from "@/components/NewsArticlesGrid";
import { NewsArticle } from "@/models/NewsArticles";
import { FormEvent, useState } from "react"
import {Form,Button,Spinner} from 'react-bootstrap'

const SearchNewsPage = () => {
const [searchResults,setSearchResults] =useState<NewsArticle[] | null >(null);
const [searchResultsLoading,setSearchResultsLoading] = useState(false);
const [searchResultsLoadingIsError,setSearchResultsLoadingIsError] = useState(false);

async function handleSubmit(e:FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const formData =new FormData(e.target as HTMLFormElement);
  const searchQuery=formData.get("searchQuery")?.toString().trim();

  if(searchQuery){
    try{
      setSearchResults(null);
      setSearchResultsLoadingIsError(false);
      setSearchResultsLoading(true);
      const response = await fetch("/api/search-news?q="+searchQuery);
      const articles: NewsArticle[]=await response.json();
      setSearchResults(articles);
    }
    catch(error){
      console.log(error);
      setSearchResultsLoadingIsError(true);
    }
    finally{
      setSearchResultsLoading(false);
    }
  }
}

  return (
    <main>
    <h1>Search News</h1>  
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="search-input">
        <Form.Label>Search query</Form.Label>
        <Form.Control name="searchQuery"
        placeholder="E.g. product,plants"/>
      </Form.Group>
      <Button type="submit" className="mb-3" disabled={searchResultsLoading}>Search</Button>
    </Form>
    <div className="d-flex flex-column align-items-center">
      {searchResultsLoading && <Spinner animation="border"/>}
      {searchResultsLoadingIsError && <p>Something went wrong. Please try again.</p>}
      {searchResults?.length===0 && <p>Nothing found. Try a different query.</p>}
      {searchResults && <NewsArticlesGrid articles={searchResults}/>}
    </div>
    </main>
  )
}

export default SearchNewsPage