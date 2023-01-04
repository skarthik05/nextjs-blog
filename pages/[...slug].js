import Layout from "../components/layout";
// import Date from '../components/date';
import { getPageData, splitFilesByPath } from "../lib/experiment";
import {GetRepoFilesAPI} from '../lib/githubApis'
import utilStyles from '../styles/utils.module.css'
import Head from "next/head";
import { useRouter } from 'next/router'
import Link from 'next/link';

import path from 'path'
export default function Post({ postData,files }) {
    const router = useRouter()
    const {query:{slug}} =router
    
const baseRoutes = []
const uniqueFolders = {}
const baseFolders = files

baseFolders.forEach(file => {
  let folderName = file.path.replace(slug.join('/'),'').split("/")[1]
  baseRoutes.push({
    path: '/' + file.path,
    title: `${folderName.charAt(0).toUpperCase()}${folderName.slice(1)}`,
  })

})
  return (
    <Layout>
    <Head>
      <title>{postData?.title}</title>
    </Head>
    <article>
      <h1 className={utilStyles.headingXl}>{postData?.title}</h1>
      <div className={utilStyles.lightText}>
      </div>
      postData?postData &&(

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
    
    </article>
  </Layout>

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
  paths:[],
  fallback: "blocking",
};
}
export async function getStaticProps({params:{slug}}) {
 let postData=null,files=[];
 const isFile=slug[slug.length-1].includes('.')
 let path = slug.join('/')
 if(isFile){
   postData = await getPageData(path);
 }
else{
files = await GetRepoFilesAPI({path})
}
  return {
    props: {
      postData,
      files
    },
    revalidate: 5
  };
}
