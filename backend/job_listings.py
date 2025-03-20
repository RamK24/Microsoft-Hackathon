from serpapi import GoogleSearch
from dotenv import load_dotenv
import requests
load_dotenv()
import os


def get_google_listings(job_title, location):
    params = {
      "engine": "google_jobs",
      "q": job_title,
      "location": location,
      "hl": "en",
      "api_key": os.getenv("GOOGLE_JOBS_KEY")
    }
    search = GoogleSearch(params)
    results = search.get_dict()
    jobs_results = results["jobs_results"]
    return jobs_results


def get_adzuna_listings(job_title, location):
      COUNTRY_CODE = "us"
      base_url = f"https://api.adzuna.com/v1/api/jobs/{COUNTRY_CODE}/search/1"
      params = {
        "app_id": os.getenv("ADZUNA_APP_ID"),
        "app_key": os.getenv("ADZUNA_KEY"),
        "what": job_title,
        "where": location,
        "results_per_page": 10,
        "max_days_old": 15,
        "part_time": 1
      }
      try:
          response = requests.get(base_url, params=params)
          response.raise_for_status()
          data = response.json()

          return data.get("results", [])

      except requests.exceptions.RequestException as e:
          print(f"Error: {e}")
          return []




