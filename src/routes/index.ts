import { Router } from "express";

import testRoute from "./test/test-api";

const router = Router();

router.use("/test", testRoute);

export default router;
