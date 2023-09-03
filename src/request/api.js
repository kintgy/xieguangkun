/**
 * api接口的统一出口
 */
import admin from "@/request/api/admin/index"
import auth from '@/request/api/auth'
import performance from "@/request/api/performance"
import system from "@/request/api/system"
import upload from "@/request/api/upload"
import user from "@/request/api/user"
import job from "@/request/api/job"
import common from "@/request/api/common";

export default {
  admin, performance,
  auth, system, upload, user,job, common
}
