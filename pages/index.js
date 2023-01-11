import Head from 'next/head'
import Editor from "@monaco-editor/react";
import { useRef, useState } from 'react';
import Link from 'next/link';


import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import {getSortedPostsData} from '../lib/posts'
import { GetUserRepos } from '../lib/githubApis';
export default function Home({allPostsData,files,parentChildTree,repoList}) {
  const [languages,setLanguages] = useState(null)
  const [language, setLanguage] =useState('javascript')
const editorRef = useRef(null)
const monacoRef = useRef(null)
// console.log(test,'t-t')

const baseRoutes = []
const baseFolders = files

baseFolders.forEach(file => {
if(file.type=='tree')
  baseRoutes.push({
    path:`/${file.path}`,
    title: `${file.path.charAt(0).toUpperCase()}${file.path.slice(1)}`,
  })


})
  function handleEditorChange(value, event) {
    // let monacorInstance = useMonaco()
    // here is the current value
    console.log({event})
    console.log({value})
   
    // monacorInstance.editor.setModelLanguage(editorInstance.getModal,language)
    // console.log(monacorInstance?.editor?.getModel(),'mo')
    // monaco.editor.setModelLanguage({})
  }

  async function handleEditorDidMount(editor, monaco) {
    editorRef.current=editor;
    monacoRef.current=monaco
    const allLangs =await monaco.languages.getLanguages()
    setLanguages(allLangs.map(({id})=>id))
   
  }

  function handleEditorWillMount(monaco) {
    console.log("beforeMount: the monaco instance:", monaco);
    // monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  }

  function handleEditorValidation(markers) {
    // model markers
    markers.forEach(marker => console.log('onValidate:', marker.message));
  }
  function renderListOfLanguages(){
    return languages?.length && languages.map((lang,id)=><option key={id} value={lang}>{lang}</option>)
  }
  
/*
 <Layout home>
    
      <Head>
        <title>{siteTitle}</title>
      </Head>
    
     {false &&( <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Headers</h2>
        <ul className={utilStyles.list}>
       
        {baseRoutes?.length && baseRoutes.map((route,index)=>(
          <li className={utilStyles.listItem} key={index}>

          <Link key={index} 
          href={route.path}
          >
                      {route.title}
          </Link>
          </li>
  ))}
  
        </ul>
      </section>)}

<section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Projects</h2>
        <ul className={utilStyles.list}>
       
        {repoList?.length && repoList.map((route,index)=>(
          <li className={utilStyles.listItem} key={index}>

          <Link key={index} 
          href={route.name}
          >
                      {route.name}
          </Link>
          </li>
  ))}
  
        </ul>
      </section>
      
      <select value={language} onChange={(e)=>handleLanguage(e.target.value)}>

      {renderListOfLanguages()}
      </select>
      
      <Editor
      height="90vh"
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      beforeMount={handleEditorWillMount}
      onValidate={handleEditorValidation}
      defaultLanguage={language}
      defaultValue="// some comment"
    />

    </Layout>
*/
  return (
  
    <Layout home>
    
    <Head>
      <title>{siteTitle}</title>
    </Head>
  
   {false &&( <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
      <h2 className={utilStyles.headingLg}>Headers</h2>
      <ul className={utilStyles.list}>
     
      {baseRoutes?.length && baseRoutes.map((route,index)=>(
        <li className={utilStyles.listItem} key={index}>

        <Link key={index} 
        href={route.path}
        >
                    {route.title}
        </Link>
        </li>
))}

      </ul>
    </section>)}

<section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
      <h2 className={utilStyles.headingLg}>Projects</h2>
      <ul className={utilStyles.list}>
     
      {repoList?.length && repoList.map((route,index)=>(
        <li className={utilStyles.listItem} key={index}>

        <Link key={index} 
        href={route.name}
        >
                    {route.name}
        </Link>
        </li>
))}

      </ul>
    </section>
    
    <select value={language} onChange={(e)=>handleLanguage(e.target.value)}>

    {renderListOfLanguages()}
    </select>
    
    <Editor
    height="90vh"
    onChange={handleEditorChange}
    onMount={handleEditorDidMount}
    beforeMount={handleEditorWillMount}
    onValidate={handleEditorValidation}
    defaultLanguage={language}
    defaultValue="// some comment"
  />

  </Layout>
  )
}


export async function getStaticProps(context) {
  const allPostsData = getSortedPostsData();
  const treeList = []//await GetRepoByBranchTreeApi({branchName:'main'})
  const parentChildTree =  []//walk(treeList)
  const repoList = await GetUserRepos({username:"skarthik05"}) ?? []
  return {
    props: {
      allPostsData,
      files:treeList,
      parentChildTree,
      repoList
    },
  };
}
