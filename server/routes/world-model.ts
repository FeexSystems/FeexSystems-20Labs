import { Request, Response, Router } from "express";
import { getPinnedWorldModelProjects, processWebhook, retrieveWorld, syncPinnedProjects, verifyGitHubSignature } from "../lib/services/github-pinned.service";

const router = Router();

type RawRequest = Request & { rawBody?: Buffer };

router.get("/projects", async (_req: Request, res: Response) => {
  try { const projects=await getPinnedWorldModelProjects(); res.json({success:true,source:"world-model",projects,count:Array.isArray(projects)?projects.length:0}); }
  catch(error){res.status(500).json({success:false,error:error instanceof Error?error.message:"World Model query failed"});}
});

router.get("/navigator", async (req:Request,res:Response)=>{
  try{const q=String(req.query.q||"").trim();if(!q)return res.status(400).json({success:false,error:"Query is required"});res.json({success:true,data:await retrieveWorld(q)});}
  catch(error){res.status(500).json({success:false,error:error instanceof Error?error.message:"Navigator retrieval failed"});}
});

router.post("/sync/github-pinned", async (_req:Request,res:Response)=>{
  try{const projects=await syncPinnedProjects();res.json({success:true,source:"github-profile-pinned",synchronizedAt:new Date().toISOString(),projects,count:projects.length});}
  catch(error){console.error("GitHub pinned World Model sync failed:",error);res.status(502).json({success:false,error:error instanceof Error?error.message:"GitHub synchronization failed"});}
});

router.post("/webhook", async (req:RawRequest,res:Response)=>{
  const raw=req.rawBody?.toString("utf8")||JSON.stringify(req.body);
  if(!verifyGitHubSignature(raw,req.header("x-hub-signature-256")))return res.status(401).json({success:false,error:"Invalid GitHub webhook signature"});
  try{
    const payload=req.body;
    if(payload.ref&&payload.ref!=="refs/heads/main")return res.status(202).json({success:true,ignored:true,reason:"non-main branch"});
    const result=await processWebhook(payload);res.status(202).json({success:true,data:result});
  }catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:"Invalid webhook"});}
});

export default router;
