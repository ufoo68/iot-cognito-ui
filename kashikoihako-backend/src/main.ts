import { App, Stack, StackProps, aws_s3, RemovalPolicy, aws_cloudfront, aws_iam, aws_s3_deployment, CfnOutput } from 'aws-cdk-lib'
import { Construct } from 'constructs'

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props)

    const websiteBucket = new aws_s3.Bucket(this, 'WebsiteBucket', {
      websiteErrorDocument: 'index.html',
      websiteIndexDocument: 'index.html',
      removalPolicy: RemovalPolicy.DESTROY,
    })

    const websiteIdentity = new aws_cloudfront.OriginAccessIdentity(
      this,
      'WebsiteIdentity',
    )

    const webSiteBucketPolicyStatement = new aws_iam.PolicyStatement({
      actions: ['s3:GetObject'],
      effect: aws_iam.Effect.ALLOW,
      principals: [
        websiteIdentity.grantPrincipal,
      ],
      resources: [`${websiteBucket.bucketArn}/*`],
    })

    websiteBucket.addToResourcePolicy(webSiteBucketPolicyStatement)

    const websiteDistribution = new aws_cloudfront.CloudFrontWebDistribution(
      this,
      'WebsiteDistribution',
      {
        errorConfigurations: [
          {
            errorCachingMinTtl: 0,
            errorCode: 403,
            responseCode: 200,
            responsePagePath: '/index.html',
          },
          {
            errorCachingMinTtl: 0,
            errorCode: 404,
            responseCode: 200,
            responsePagePath: '/index.html',
          },
        ],
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: websiteBucket,
              originAccessIdentity: websiteIdentity,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
              },
            ],
          },
        ],
        priceClass: aws_cloudfront.PriceClass.PRICE_CLASS_200,
      },
    )

    new aws_s3_deployment.BucketDeployment(this, 'WebsiteDeploy', {
      sources: [aws_s3_deployment.Source.asset('../build')],
      destinationBucket: websiteBucket,
      distribution: websiteDistribution,
      distributionPaths: ['/*'],
    })

    new CfnOutput(this, 'URL', {
      exportName: 'cfUrl',
      value: `https://${websiteDistribution.distributionDomainName}`,
    })
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
}

const app = new App()

new MyStack(app, 'kashikoihako-dev', { env: devEnv })

app.synth()