import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { useRef, useState } from "react";
import Editor from "@monaco-editor/react";

import Layout from "../components/layout";
// import Date from '../components/date';
import { getPageData, splitFilesByPath, walk } from "../lib/experiment";
import {
  GetRepoByBranchTreeApiRecursive,
  GetRepoFilesAPI,
  GetRepoByBranchTreeApi,
  GetUserRepos
} from "../lib/githubApis";
import utilStyles from "../styles/utils.module.css";
import TreeFilter from "../components/TreeFilter";
import path from "path";
export default function Post({ postData, files, parentChildTree,repoList }) {
  const router = useRouter();
  const {
    asPath,
    query: { slug },
  } = router;
  const [languages, setLanguages] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const baseRoutes = [];
  const uniqueFolders = {};
  const baseFolders = files;
  baseFolders.forEach((file) => {
    //   let folderName = file.path.split("/")[0]
    // if(!/.md*$/.test(folderName))
    //   uniqueFolders[folderName] = null
    if (file.type == "tree")
      baseRoutes.push({
        path: `/${slug[0]}/${file.path}`,
        title: `${file.path.charAt(0).toUpperCase()}${file.path.slice(1)}`,
      });
  });
  function handleEditorChange(value, event) {
    // let monacorInstance = useMonaco()
    // here is the current value
    console.log({ event });
    console.log({ value });

    // monacorInstance.editor.setModelLanguage(editorInstance.getModal,language)
    // console.log(monacorInstance?.editor?.getModel(),'mo')
    // monaco.editor.setModelLanguage({})
  }

  async function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;
    const allLangs = await monaco.languages.getLanguages();
    setLanguages(allLangs.map(({ id }) => id));
  }

  function handleEditorWillMount(monaco) {
    console.log("beforeMount: the monaco instance:", monaco);
    // monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  }

  function handleEditorValidation(markers) {
    // model markers
    markers.forEach((marker) => console.log("onValidate:", marker.message));
  }
  function renderListOfLanguages() {
    return (
      languages?.length &&
      languages.map((lang, id) => (
        <option key={id} value={lang}>
          {lang}
        </option>
      ))
    );
  }
  /*
 <Layout>
    <Head>
      <title>{postData?.title}</title>
    </Head>
    <article>
      <h1 className={utilStyles.headingXl}>{postData?.title}</h1>
      <div className={utilStyles.lightText}>
      </div>
      {postData?postData &&(

        <div dangerouslySetInnerHTML={{ __html: postData?.contentHtml }} />
):
      (
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
      )
    }
    </article>
  </Layout>

  Monaco Editor
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
*/
  return (
    <>
  {!slug &&(  <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
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
    </section>)}
  {slug?.length && (  <div className="row">
      {parentChildTree?.length ? (
        <div style={{ float: "left", width: "50%" }}>
          <TreeFilter data={parentChildTree} url={asPath} />
        </div>
      ) : (
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <h2 className={utilStyles.headingLg}>Headers</h2>
          <ul className={utilStyles.list}>
            {baseRoutes?.length &&
              baseRoutes.map((route, index) => (
                <li className={utilStyles.listItem} key={index}>
                  <Link key={index} href={route.path}>
                    {route.title}
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      )}
      <div style={{ float: "left", width: "50%" }}>
        {postData && (
          <>
            <h1 className={utilStyles.headingXl}>{postData?.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: postData?.contentHtml }} />
          </>
        )}
      </div>
    </div>)}
    </>
  );
}
//Calls for local files
// export async function getStaticPaths(context) {
//     const files = await getAllFiles(path.join(process.cwd(),'sample'),[])
//    const paths=await splitFileByPaths(files)
//   return {
//     paths,
//     fallback: true,
//   };
// }

export async function getStaticPaths() {
  // const {params}=context
  // console.log(params,'pa')
  // const treeFiles = await GetRepoByBranchTreeApi({branchName:'main'})
  // const paths = await GetFileContents(treeFiles)
  // // const paths = await splitFilesByPath(contents)
  // console.log(paths,'paths')
  return {
    paths: [],
    fallback: "blocking", //creates new path if not exist
  };
}
export async function getStaticProps({ params: { slug } }) {
  let postData = null,
    files = [],
    parentChildTree = [],
    repoList=[],
    filterByParentFolder = [],
    treeList = [];
  if (!slug?.length){

    repoList = await GetUserRepos({ username: "skarthik05" }) ?? [];
  }
  else if(slug.length == 1) {
    treeList = await GetRepoByBranchTreeApi({
      branchName: "main",
      GITHUB_REPO: slug[0],
    });
  } else {
    const startWith = new RegExp("^" + slug[1]);
    // console.log({startWith},{slug})
    const recursiveTree = await GetRepoByBranchTreeApiRecursive({
      branchName: "main",
      GITHUB_REPO: slug[0],
    });
    filterByParentFolder = recursiveTree.filter((file) =>
      startWith.test(file.path)
    );
    parentChildTree = walk(filterByParentFolder, slug[0]);
    let path = slug.slice(1).join("/");
  const isFile = slug[slug.length - 1].includes(".");

    if (isFile) {
      postData = (await getPageData(path, slug[0])) ?? null;
    }
  }
  // else{
  // files = []//await GetRepoFilesAPI({path})
  // }
  return {
    props: {
      postData,
      files: treeList,
      parentChildTree,
      repoList
    },
    revalidate: 5,
  };
}
