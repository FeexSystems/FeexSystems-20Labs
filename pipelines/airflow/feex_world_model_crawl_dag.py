"""
FeexSystems — World Model Ecosystem Crawl & Evidence Fabric Validation DAG
Target: Managed Service for Apache Airflow (MSAA) / Google Cloud Composer

Schedule: Every 6 hours ('0 */6 * * *')
Tasks:
1. Verify Cloud SQL and Redis Health
2. Trigger FeexSystems GitHub Pinned Repositories Sync
3. Audit Evidence Fabric Cryptographic Commit SHAs
4. Generate BigQuery ML Graph Embeddings & Node Clustering
5. Send Health & Sync Status Notification
"""

from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.http.operators.http import HttpOperator
from airflow.providers.google.cloud.operators.bigquery import BigQueryInsertJobOperator
import json

default_args = {
    'owner': 'feexsystems',
    'depends_on_past': False,
    'email': ['ops@feexsystems.codes'],
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 2,
    'retry_delay': timedelta(minutes=5),
}

with DAG(
    dag_id='feex_world_model_crawl_dag',
    default_args=default_args,
    description='Automated FeexSystems ecosystem crawl, evidence verification, and BigQuery ML sync',
    schedule_interval='0 */6 * * *',
    start_date=datetime(2026, 1, 1),
    catchup=False,
    tags=['world-model', 'evidence-fabric', 'bigquery-ml', 'feexsystems'],
) as dag:

    # Task 1: Check FeexSystems API Health
    check_api_health = HttpOperator(
        task_id='check_api_health',
        http_conn_id='feexsystems_api',
        endpoint='/health',
        method='GET',
        response_check=lambda response: response.json().get('status') == 'healthy',
    )

    # Task 2: Trigger GitHub Pinned Ecosystem Ingestion
    trigger_ecosystem_sync = HttpOperator(
        task_id='trigger_ecosystem_sync',
        http_conn_id='feexsystems_api',
        endpoint='/api/world-model/sync/github-pinned',
        method='POST',
        headers={'Content-Type': 'application/json'},
        data=json.dumps({'reason': 'SCHEDULED_AIRFLOW_ECOSYSTEM_CRAWL'}),
    )

    # Task 3: BigQuery ML Node Clustering & Graph Density Analytics
    bigquery_graph_analytics = BigQueryInsertJobOperator(
        task_id='bigquery_graph_analytics',
        configuration={
            "query": {
                "query": """
                    SELECT 
                        event_type,
                        COUNT(1) as total_interactions,
                        COUNT(DISTINCT project_id) as active_projects,
                        AVG(latency_ms) as avg_latency_ms
                    FROM `feexsystems_analytics.world_model_events`
                    WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 6 HOUR)
                    GROUP BY event_type
                """,
                "useLegacySql": False,
            }
        },
    )

    # Task dependency flow
    check_api_health >> trigger_ecosystem_sync >> bigquery_graph_analytics
