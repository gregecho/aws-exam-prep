insert into questions (domain, question, question_type, options_json, correct, explanations_json) values

-- ============================================================
-- Design Secure Architectures (single-answer)
-- ============================================================
('Design Secure Architectures',
 'A company needs to store sensitive customer data in Amazon S3. The data must be encrypted at rest and the company must manage the encryption keys. Which solution meets these requirements?',
 'single',
 '[{"key":"A","text":"Enable SSE-S3 (AES-256) on the S3 bucket"},{"key":"B","text":"Enable SSE-KMS using a customer-managed KMS key"},{"key":"C","text":"Enable SSE-C and provide the key with each request"},{"key":"D","text":"Use client-side encryption with an AWS managed key"}]',
 'B',
 '{"A":"SSE-S3 uses AWS-managed keys — the company has no control over key rotation or access policies.","B":"SSE-KMS with a customer-managed key (CMK) lets the company control key rotation, access policies, and audit usage via CloudTrail. This is the correct answer.","C":"SSE-C requires the client to manage and send the key on every request, which is operationally complex and error-prone.","D":"Client-side encryption with an AWS managed key does not give the company full key control."}'
),

('Design Secure Architectures',
 'An application running on EC2 needs to access an S3 bucket. What is the most secure way to grant this access?',
 'single',
 '[{"key":"A","text":"Store AWS access keys in the application code"},{"key":"B","text":"Store AWS access keys in environment variables on the instance"},{"key":"C","text":"Attach an IAM role to the EC2 instance with the required S3 permissions"},{"key":"D","text":"Create an IAM user and store its credentials in AWS Secrets Manager"}]',
 'C',
 '{"A":"Hardcoding credentials in source code is a critical security risk — they can be leaked via version control.","B":"Environment variables on the instance are better than code but still require manual rotation and can be exposed.","C":"IAM roles for EC2 provide temporary, automatically rotated credentials via the instance metadata service. No long-term credentials need to be stored. This is the correct answer.","D":"IAM users produce long-term credentials that require manual rotation, even when stored in Secrets Manager."}'
),

('Design Secure Architectures',
 'A solutions architect needs to ensure that only traffic from a specific VPC can access an S3 bucket. Which feature should be used?',
 'single',
 '[{"key":"A","text":"S3 bucket ACL"},{"key":"B","text":"S3 Block Public Access"},{"key":"C","text":"VPC endpoint policy combined with an S3 bucket policy"},{"key":"D","text":"Security group on the S3 bucket"}]',
 'C',
 '{"A":"S3 ACLs control object-level permissions but cannot restrict access by VPC.","B":"Block Public Access prevents public access but does not restrict to a specific VPC.","C":"A Gateway VPC endpoint for S3 combined with a bucket policy using aws:SourceVpc ensures only traffic from that VPC can reach the bucket. This is the correct answer.","D":"S3 is not a VPC resource and does not support security groups."}'
),

('Design Secure Architectures',
 'A company wants to allow users to authenticate using their existing corporate Active Directory credentials to access AWS resources. Which service enables this?',
 'single',
 '[{"key":"A","text":"Amazon Cognito User Pools"},{"key":"B","text":"AWS IAM Identity Center (SSO) with AD Connector"},{"key":"C","text":"AWS Directory Service for Microsoft Active Directory"},{"key":"D","text":"Amazon Cognito Identity Pools"}]',
 'B',
 '{"A":"Cognito User Pools manage user identities for web/mobile apps, not corporate AD federation to AWS.","B":"IAM Identity Center with AD Connector federates existing on-premises AD credentials to AWS accounts and applications. This is the correct answer.","C":"AWS Managed Microsoft AD creates a new AD in AWS — it does not federate existing on-premises AD credentials directly.","D":"Cognito Identity Pools provide temporary AWS credentials for app users, not corporate AD federation."}'
),

('Design Secure Architectures',
 'A web application stores user passwords in a database. Which approach best protects these passwords?',
 'single',
 '[{"key":"A","text":"Encrypt passwords using AES-256 and store the encryption key in the same database"},{"key":"B","text":"Store passwords as MD5 hashes"},{"key":"C","text":"Store passwords as bcrypt hashes with a unique salt per user"},{"key":"D","text":"Store passwords in AWS Secrets Manager and reference them from the database"}]',
 'C',
 '{"A":"Storing the encryption key alongside the encrypted data provides no real protection if the database is compromised.","B":"MD5 is a fast hash — it is vulnerable to rainbow table and brute-force attacks and should never be used for passwords.","C":"bcrypt is a slow, adaptive hashing algorithm designed for passwords. A unique salt per user prevents rainbow table attacks. This is the correct answer.","D":"Secrets Manager stores application secrets like API keys, not user passwords — it is not designed for per-user password storage."}'
),

-- ============================================================
-- Design Secure Architectures (multiple-answer)
-- ============================================================
('Design Secure Architectures',
 'A company needs to protect its AWS account from unauthorized access. Which TWO actions should a solutions architect recommend? (Select TWO)',
 'multiple',
 '[{"key":"A","text":"Enable MFA on the root account and all IAM users"},{"key":"B","text":"Share the root account credentials with the security team"},{"key":"C","text":"Use IAM roles instead of long-term access keys where possible"},{"key":"D","text":"Store root account credentials in AWS Secrets Manager"},{"key":"E","text":"Create a single IAM admin user for all team members to share"}]',
 'A,C',
 '{"A":"MFA adds a second factor of authentication, significantly reducing the risk of credential compromise. This is correct.","B":"Root credentials should never be shared — the root account should be locked away and rarely used.","C":"IAM roles provide temporary credentials that are automatically rotated, eliminating the risk of long-term key exposure. This is correct.","D":"Root credentials should not be stored anywhere — they should be locked away with MFA enabled.","E":"Shared IAM users make auditing impossible and violate the principle of least privilege."}'
),

('Design Secure Architectures',
 'A solutions architect is designing a multi-tier web application. Which TWO measures improve the security of the database tier? (Select TWO)',
 'multiple',
 '[{"key":"A","text":"Place the database in a private subnet with no internet gateway route"},{"key":"B","text":"Use a security group that allows inbound traffic only from the application tier security group"},{"key":"C","text":"Assign a public IP address to the database instance for monitoring"},{"key":"D","text":"Enable automated backups and store them in a public S3 bucket"},{"key":"E","text":"Use AWS Shield Standard to protect the database"}]',
 'A,B',
 '{"A":"A private subnet with no internet route ensures the database is not directly reachable from the internet. This is correct.","B":"Restricting inbound traffic to only the application tier security group enforces least-privilege network access. This is correct.","C":"Assigning a public IP exposes the database to the internet, which is a security risk.","D":"Storing backups in a public S3 bucket exposes sensitive data — backups should be in a private bucket.","E":"AWS Shield Standard protects against DDoS at the network edge, not database-tier access control."}'
),

-- ============================================================
-- Design Resilient Architectures (single-answer)
-- ============================================================
('Design Resilient Architectures',
 'A company runs a critical application on a single EC2 instance. The application must remain available if the instance fails. What is the simplest solution?',
 'single',
 '[{"key":"A","text":"Create an AMI and launch a second instance in the same AZ"},{"key":"B","text":"Use an Auto Scaling group with a minimum of 1 and desired capacity of 1 across multiple AZs"},{"key":"C","text":"Enable EC2 instance termination protection"},{"key":"D","text":"Take daily EBS snapshots of the instance"}]',
 'B',
 '{"A":"A second instance in the same AZ does not protect against AZ failure and requires manual failover.","B":"An Auto Scaling group automatically replaces a failed instance and can span multiple AZs for AZ-level resilience. This is the correct answer.","C":"Termination protection prevents accidental termination but does not recover from instance failure.","D":"EBS snapshots enable recovery but require manual intervention and result in downtime."}'
),

('Design Resilient Architectures',
 'An application needs to process messages reliably even if the processing service temporarily goes down. Which AWS service best decouples the producer from the consumer?',
 'single',
 '[{"key":"A","text":"Amazon SNS"},{"key":"B","text":"Amazon SQS"},{"key":"C","text":"Amazon Kinesis Data Streams"},{"key":"D","text":"AWS Step Functions"}]',
 'B',
 '{"A":"SNS is a pub/sub service — messages are pushed to subscribers immediately and are not retained if the subscriber is unavailable.","B":"SQS is a durable message queue that retains messages until they are successfully processed, decoupling producers from consumers. This is the correct answer.","C":"Kinesis is designed for real-time streaming analytics, not simple task queue decoupling.","D":"Step Functions orchestrates workflows but is not a message queue for producer-consumer decoupling."}'
),

('Design Resilient Architectures',
 'A company wants to ensure its RDS database can survive an Availability Zone failure with minimal downtime. Which feature should be enabled?',
 'single',
 '[{"key":"A","text":"Read Replicas"},{"key":"B","text":"Multi-AZ deployment"},{"key":"C","text":"Automated backups"},{"key":"D","text":"Enhanced Monitoring"}]',
 'B',
 '{"A":"Read Replicas improve read performance but are not automatically promoted during a primary failure — they require manual intervention.","B":"Multi-AZ maintains a synchronous standby replica in a different AZ and automatically fails over within 1-2 minutes. This is the correct answer.","C":"Automated backups enable point-in-time recovery but require manual restore, resulting in significant downtime.","D":"Enhanced Monitoring provides OS-level metrics but has no impact on availability."}'
),

('Design Resilient Architectures',
 'A company hosts a static website on S3. They want to ensure the website remains available even if an entire AWS region becomes unavailable. What should they do?',
 'single',
 '[{"key":"A","text":"Enable S3 versioning on the bucket"},{"key":"B","text":"Use S3 Cross-Region Replication and Route 53 with health checks for failover"},{"key":"C","text":"Enable S3 Transfer Acceleration"},{"key":"D","text":"Use CloudFront with a single S3 origin"}]',
 'B',
 '{"A":"Versioning protects against accidental deletion but does not provide cross-region availability.","B":"Cross-Region Replication copies objects to a bucket in another region, and Route 53 health checks can automatically route traffic to the secondary region on failure. This is the correct answer.","C":"Transfer Acceleration speeds up uploads to S3 but does not improve availability.","D":"CloudFront caches content at edge locations but still depends on a single S3 origin — a regional outage would affect origin fetches."}'
),

('Design Resilient Architectures',
 'An e-commerce application experiences unpredictable traffic spikes during sales events. Which architecture best handles this?',
 'single',
 '[{"key":"A","text":"Provision EC2 instances for peak load at all times"},{"key":"B","text":"Use an Application Load Balancer with an Auto Scaling group"},{"key":"C","text":"Use a larger EC2 instance type (vertical scaling)"},{"key":"D","text":"Pre-warm the application servers before each sale"}]',
 'B',
 '{"A":"Provisioning for peak load wastes resources during normal traffic and is expensive.","B":"An ALB distributes traffic across instances, and Auto Scaling adds or removes instances based on demand, handling spikes automatically. This is the correct answer.","C":"Vertical scaling has limits and requires downtime to resize — it cannot respond dynamically to traffic spikes.","D":"Pre-warming requires predicting spike timing and does not handle unexpected traffic increases."}'
),

-- ============================================================
-- Design Resilient Architectures (multiple-answer)
-- ============================================================
('Design Resilient Architectures',
 'A solutions architect is designing a highly available web application. Which TWO design choices improve availability? (Select TWO)',
 'multiple',
 '[{"key":"A","text":"Deploy EC2 instances across multiple Availability Zones"},{"key":"B","text":"Use a single large EC2 instance with enhanced networking"},{"key":"C","text":"Use an Elastic Load Balancer to distribute traffic"},{"key":"D","text":"Store session state on the local EC2 instance disk"},{"key":"E","text":"Use a single RDS instance in one AZ"}]',
 'A,C',
 '{"A":"Spreading instances across multiple AZs ensures the application survives an AZ failure. This is correct.","B":"A single instance is a single point of failure regardless of its size.","C":"An ELB distributes traffic and performs health checks, routing away from unhealthy instances. This is correct.","D":"Local disk session state is lost if the instance fails — use ElastiCache or DynamoDB for session storage.","E":"A single RDS instance in one AZ is a single point of failure — use Multi-AZ for high availability."}'
),

-- ============================================================
-- Design High-Performing Architectures (single-answer)
-- ============================================================
('Design High-Performing Architectures',
 'A read-heavy web application is experiencing high latency on database queries. The data rarely changes. What is the best solution?',
 'single',
 '[{"key":"A","text":"Upgrade to a larger RDS instance"},{"key":"B","text":"Add an ElastiCache cluster in front of the database"},{"key":"C","text":"Enable RDS Multi-AZ"},{"key":"D","text":"Use RDS Proxy"}]',
 'B',
 '{"A":"Upgrading the instance improves capacity but does not reduce latency for repeated queries on static data.","B":"ElastiCache caches frequently read data in memory, reducing database load and query latency dramatically for rarely-changing data. This is the correct answer.","C":"Multi-AZ improves availability, not read performance.","D":"RDS Proxy improves connection pooling for Lambda workloads but does not cache query results."}'
),

('Design High-Performing Architectures',
 'A company needs to deliver large media files to a global audience with low latency. Which service should they use?',
 'single',
 '[{"key":"A","text":"Amazon S3 with Transfer Acceleration"},{"key":"B","text":"Amazon CloudFront"},{"key":"C","text":"AWS Global Accelerator"},{"key":"D","text":"Amazon Route 53 latency-based routing"}]',
 'B',
 '{"A":"S3 Transfer Acceleration speeds up uploads to S3, not downloads to end users.","B":"CloudFront is a CDN that caches content at 400+ edge locations worldwide, delivering files to users from the nearest edge with low latency. This is the correct answer.","C":"Global Accelerator improves performance for dynamic TCP/UDP traffic using the AWS backbone, but is not optimized for static media caching.","D":"Route 53 latency routing directs users to the nearest region but does not cache content at the edge."}'
),

('Design High-Performing Architectures',
 'An application needs to process 1 million small database writes per second. Which AWS database service is best suited for this workload?',
 'single',
 '[{"key":"A","text":"Amazon RDS MySQL"},{"key":"B","text":"Amazon Redshift"},{"key":"C","text":"Amazon DynamoDB"},{"key":"D","text":"Amazon Aurora Serverless"}]',
 'C',
 '{"A":"RDS MySQL is optimized for relational workloads and cannot scale to millions of writes per second without significant sharding complexity.","B":"Redshift is a data warehouse optimized for analytical queries, not high-throughput transactional writes.","C":"DynamoDB is a fully managed NoSQL database that can handle millions of requests per second with single-digit millisecond latency. This is the correct answer.","D":"Aurora Serverless scales automatically but has cold-start latency and is not designed for sustained million-writes-per-second workloads."}'
),

('Design High-Performing Architectures',
 'A data processing pipeline needs to ingest and analyze streaming data from thousands of IoT devices in real time. Which service is most appropriate?',
 'single',
 '[{"key":"A","text":"Amazon SQS"},{"key":"B","text":"Amazon Kinesis Data Streams"},{"key":"C","text":"Amazon SNS"},{"key":"D","text":"AWS Batch"}]',
 'B',
 '{"A":"SQS is a message queue for decoupling services — it does not support real-time stream analytics or multiple consumers reading the same data.","B":"Kinesis Data Streams is designed for real-time ingestion and processing of high-throughput streaming data from many producers. This is the correct answer.","C":"SNS is a pub/sub notification service, not a streaming data platform.","D":"AWS Batch is for batch computing jobs, not real-time stream processing."}'
),

('Design High-Performing Architectures',
 'A company wants to improve the performance of its Lambda functions that connect to an RDS database. The functions experience connection timeouts during traffic spikes. What should they use?',
 'single',
 '[{"key":"A","text":"Increase the Lambda function timeout"},{"key":"B","text":"Use RDS Proxy to pool and reuse database connections"},{"key":"C","text":"Switch to DynamoDB"},{"key":"D","text":"Increase the RDS instance size"}]',
 'B',
 '{"A":"Increasing the timeout does not solve connection exhaustion — it just waits longer before failing.","B":"RDS Proxy maintains a pool of database connections and multiplexes Lambda invocations onto them, preventing connection exhaustion during spikes. This is the correct answer.","C":"Switching databases is a major architectural change and may not be appropriate for relational workloads.","D":"A larger instance has more connections available but does not solve the fundamental problem of Lambda creating a new connection per invocation."}'
),

-- ============================================================
-- Design High-Performing Architectures (multiple-answer)
-- ============================================================
('Design High-Performing Architectures',
 'A solutions architect needs to improve the performance of a web application. Which TWO changes would have the most impact? (Select TWO)',
 'multiple',
 '[{"key":"A","text":"Use CloudFront to cache static assets at edge locations"},{"key":"B","text":"Move the application from us-east-1 to us-west-2"},{"key":"C","text":"Add an ElastiCache layer to cache frequent database queries"},{"key":"D","text":"Enable detailed CloudWatch monitoring"},{"key":"E","text":"Use larger EC2 instance types for all servers"}]',
 'A,C',
 '{"A":"CloudFront reduces latency for static assets by serving them from edge locations close to users. This is correct.","B":"Moving regions does not improve performance unless users are closer to the new region.","C":"ElastiCache reduces database load and query latency for frequently accessed data. This is correct.","D":"Detailed monitoring improves observability but does not improve application performance.","E":"Larger instances help with CPU/memory bottlenecks but do not address network latency or database query performance."}'
),

-- ============================================================
-- Design Cost-Optimized Architectures (single-answer)
-- ============================================================
('Design Cost-Optimized Architectures',
 'A company runs a batch processing job every night for 4 hours. The job can be interrupted and restarted. Which EC2 purchasing option minimizes cost?',
 'single',
 '[{"key":"A","text":"On-Demand Instances"},{"key":"B","text":"Reserved Instances (1-year, no upfront)"},{"key":"C","text":"Spot Instances"},{"key":"D","text":"Dedicated Hosts"}]',
 'C',
 '{"A":"On-Demand is the most expensive option for predictable workloads.","B":"Reserved Instances are cost-effective for steady-state workloads but are overkill for a 4-hour nightly job.","C":"Spot Instances offer up to 90% discount over On-Demand. Since the job can be interrupted and restarted, Spot is ideal. This is the correct answer.","D":"Dedicated Hosts are the most expensive option and are used for licensing compliance, not cost optimization."}'
),

('Design Cost-Optimized Architectures',
 'A company stores 10 TB of log files in S3. The logs are accessed frequently for the first 30 days, then rarely accessed, and can be deleted after 1 year. Which S3 configuration minimizes cost?',
 'single',
 '[{"key":"A","text":"Store all logs in S3 Standard"},{"key":"B","text":"Store all logs in S3 Glacier Instant Retrieval"},{"key":"C","text":"Use S3 Lifecycle rules to transition to S3 Standard-IA after 30 days, then to S3 Glacier after 90 days, and delete after 1 year"},{"key":"D","text":"Compress logs and store in S3 One Zone-IA from day one"}]',
 'C',
 '{"A":"S3 Standard is expensive for infrequently accessed data — storing all logs there wastes money after 30 days.","B":"Glacier Instant Retrieval is cheap for archival but has higher retrieval costs for the first 30 days of frequent access.","C":"Lifecycle rules automatically move data to cheaper storage tiers as access frequency decreases, then delete it — minimizing cost across the full lifecycle. This is the correct answer.","D":"One Zone-IA reduces availability and is not appropriate for logs that need to be retained reliably for a year."}'
),

('Design Cost-Optimized Architectures',
 'A startup runs a development environment that is only used Monday–Friday, 9am–6pm. Which approach minimizes EC2 costs?',
 'single',
 '[{"key":"A","text":"Use Reserved Instances for all dev servers"},{"key":"B","text":"Use On-Demand Instances and stop them outside business hours using AWS Instance Scheduler"},{"key":"C","text":"Use Spot Instances for all dev servers"},{"key":"D","text":"Move the dev environment to AWS Lambda"}]',
 'B',
 '{"A":"Reserved Instances charge for 24/7 usage — paying for nights and weekends when the environment is unused wastes money.","B":"Stopping instances outside business hours (~45 hours/week vs 168 hours/week) reduces costs by ~73%. Instance Scheduler automates this. This is the correct answer.","C":"Spot Instances can be interrupted at any time, which disrupts developer workflows.","D":"Lambda is not suitable for a general-purpose development environment."}'
),

('Design Cost-Optimized Architectures',
 'A company wants to reduce data transfer costs for an application that frequently reads data from S3 within the same region. What should they use?',
 'single',
 '[{"key":"A","text":"S3 Transfer Acceleration"},{"key":"B","text":"A VPC Gateway Endpoint for S3"},{"key":"C","text":"CloudFront with an S3 origin"},{"key":"D","text":"AWS Direct Connect"}]',
 'B',
 '{"A":"S3 Transfer Acceleration speeds up uploads from the internet and incurs additional cost.","B":"A VPC Gateway Endpoint routes S3 traffic through the AWS private network, eliminating data transfer charges for traffic between EC2 and S3 in the same region. This is the correct answer.","C":"CloudFront adds caching but also adds cost for requests and data transfer out.","D":"Direct Connect is for on-premises to AWS connectivity, not intra-region S3 access."}'
),

('Design Cost-Optimized Architectures',
 'A company has a 3-year commitment to run a specific workload on AWS. Which purchasing option provides the greatest discount?',
 'single',
 '[{"key":"A","text":"On-Demand Instances"},{"key":"B","text":"1-year Reserved Instances, no upfront"},{"key":"C","text":"3-year Reserved Instances, all upfront"},{"key":"D","text":"3-year Savings Plans, no upfront"}]',
 'C',
 '{"A":"On-Demand has no discount.","B":"1-year no-upfront Reserved Instances offer ~30-40% discount.","C":"3-year all-upfront Reserved Instances offer the maximum discount of up to 72% over On-Demand. This is the correct answer.","D":"3-year Savings Plans offer up to 66% discount — less than all-upfront Reserved Instances for the same commitment."}'
),

-- ============================================================
-- Design Cost-Optimized Architectures (multiple-answer)
-- ============================================================
('Design Cost-Optimized Architectures',
 'A company wants to reduce its monthly AWS bill. Which TWO actions would directly reduce compute costs? (Select TWO)',
 'multiple',
 '[{"key":"A","text":"Right-size underutilized EC2 instances using AWS Compute Optimizer recommendations"},{"key":"B","text":"Enable detailed CloudWatch monitoring on all instances"},{"key":"C","text":"Purchase Savings Plans for steady-state workloads"},{"key":"D","text":"Enable VPC Flow Logs"},{"key":"E","text":"Use AWS Config to track configuration changes"}]',
 'A,C',
 '{"A":"Right-sizing eliminates waste from over-provisioned instances, directly reducing compute costs. This is correct.","B":"Detailed monitoring increases CloudWatch costs — it does not reduce compute costs.","C":"Savings Plans provide up to 66% discount on compute usage for a 1 or 3-year commitment. This is correct.","D":"VPC Flow Logs add cost for log storage and do not reduce compute costs.","E":"AWS Config tracks compliance and configuration history but does not reduce compute costs."}'
);
