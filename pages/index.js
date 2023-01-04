import Head from 'next/head'
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {useTheme} from 'next-themes'
// import * as filesystem from 'fs'

import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Date from '../components/date';
import {getSortedPostsData} from '../lib/posts'
import { GetRepoByBranchTreeApi, GetRepoContentsApi,GetRepoFileContent } from '../lib/githubApis';
export default function Home({allPostsData,files}) {
  const [languages,setLanguages] = useState(null)
  const { theme, setTheme } = useTheme()
  const [language, setLanguage] =useState('javascript')
  const [editorInstance,setEditorInstance]=useState(null)
  const [monacorInstance,setMonacoInstance]=useState(useMonaco())
const editorRef = useRef(null)
const monacoRef = useRef(null)


const baseRoutes = []
const uniqueFolders = {}
const baseFolders = files

baseFolders.forEach(file => {
  let folderName = file.path.split("/")[0]

  uniqueFolders[folderName] = null
})
Object.keys(uniqueFolders).forEach(folder => {
  baseRoutes.push({
    path:`/${folder}`,
    title: `${folder.charAt(0).toUpperCase()}${folder.slice(1)}`,
  })
})
  function handleEditorChange(value, event) {
    // let monacorInstance = useMonaco()
    // here is the current value
    console.log({event})
    console.log({value})
   
    // monacorInstance.editor.setModelLanguage(editorInstance.getModal,language)
    console.log(monacorInstance?.editor?.getModel(),'mo')
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
  function handleLanguage(lang){
    setLanguage(lang)
    monacoRef.current.editor.setModelLanguage(editorRef.current.getModel(),lang)
  }
  
  // {baseRoutes.map((route,index)=>{
  //   <Link key={index} to={route.path} className="navTabs">
  //               {route.title}
  //   </Link>
  // })}
  // {allPostsData.map(({ id, date, title }) => (
  //   <li className={utilStyles.listItem} key={id}>
  //   <Link href={`/posts/${id}`}>{title}</Link>
  //   <br />
  //   <small className={utilStyles.lightText}>
  //     <Date dateString={date} />
  //   </small>
  // </li>
  
  // ))}
  console.log(baseRoutes,'r-o')
  return (
    <Layout home>
    
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>SWE</p>
        <p>
          (This is a sample website - you’ll be building a site like this in{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
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
  const treeList = await GetRepoByBranchTreeApi({branchName:'main'})
  // const test  = GetRepoFileContent({path:"Pages/sample/first"})
  // const treeFiles = treeList.filter((file)=>file.type=='blob')
  // const treeContents = await GetRepoContentsApi(treeFiles)
  // const mdxConvResult = await mdxReadContents(treeContents)
  // console.log(mdxConvResult,'tr');
//   allPostsData.push({
//     id:'sample',
//     title: 'First-Readme',
// date: '2020-01-01'
//   })
  return {
    props: {
      allPostsData,
      files:treeList
    },
  };
}
