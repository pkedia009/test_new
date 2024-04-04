/*

# Create AWS EKS Node Group - GPU
resource "aws_eks_node_group" "eks_ng_gpu" {
  cluster_name    = aws_eks_cluster.eks_cluster.name

  node_group_name = "${local.name}-eks-ng-gpu"
  node_role_arn   = aws_iam_role.eks_nodegroup_role.arn
  subnet_ids      = module.vpc.private_subnets
  
  ami_type = "AL2_x86_64"
  capacity_type = "ON_DEMAND"
  disk_size = 20
  
  # Specify GPU instance types suitable for your workload
  instance_types = ["p3.2xlarge", "p3.8xlarge"]

  remote_access {
    ec2_ssh_key = "eks-terraform-key"
  }

  scaling_config {
    desired_size = 2  # Set desired size to 2 for two worker nodes
    min_size     = 1
    max_size     = 3  # You can adjust max_size according to your requirements
  }

  update_config {
    max_unavailable = 1
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks-AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.eks-AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.eks-AmazonEC2ContainerRegistryReadOnly,
  ] 

  tags = {
    Name = "GPU-Node-Group"
    gpu  = "true"
  }
}

*/
