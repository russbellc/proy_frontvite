import { useEffect, useState } from "react";
import { client3 } from "@/client";
import { gql } from "graphql-request";
import { isValidImage, uploadImage } from "@/graphql/WebGraph";
